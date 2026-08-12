#!/usr/bin/env python3
"""
Telegram-to-Hermes bridge (clean mode + vision).

A lightweight workaround for Hermes Agent's Telegram gateway hang
(github.com/NousResearch/hermes-agent/issues/63309) that freezes at
"Connecting to Telegram (attempt 1/8)" on many VPS environments.

- Text messages  -> Hermes oneshot (-z): reply is ONLY the answer.
- Photo messages -> Gemini (vision model): describes/answers about the image.

No secrets are hardcoded — everything is read from environment variables.
"""
import asyncio
import base64
import os

import httpx
from telegram import Update
from telegram.ext import Application, MessageHandler, CommandHandler, filters, ContextTypes

TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
HERMES_BIN = os.environ.get("HERMES_BIN", "/usr/local/bin/hermes")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.5-flash")
ALLOWED_USERS = os.environ.get("TELEGRAM_ALLOWED_USERS", "")

allowed_ids = set()
if ALLOWED_USERS and ALLOWED_USERS != "*":
    for uid in ALLOWED_USERS.split(","):
        uid = uid.strip()
        if uid:
            try:
                allowed_ids.add(int(uid))
            except ValueError:
                pass


def is_allowed(user_id: int) -> bool:
    if not allowed_ids:
        return True
    return user_id in allowed_ids


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if not is_allowed(user.id):
        await update.message.reply_text("⛔ Sorry, you are not authorized to use this bot.")
        return
    await update.message.reply_text(
        f"👋 Hello {user.first_name}! I'm your Hermes AI assistant.\n"
        f"Ask me anything in text, or send me a photo and I'll describe it.\n\n"
        f"Commands:\n/start — Show this message\n/reset — Clear conversation context\n"
    )


async def reset_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update.effective_user.id):
        return
    context.user_data.pop("session_id", None)
    await update.message.reply_text("🔄 Conversation reset. What can I help you with?")


def _split_long(text: str, limit: int = 4000):
    """Split text into Telegram-safe chunks."""
    if len(text) <= limit:
        return [text]
    chunks = []
    current = ""
    for line in text.split("\n"):
        if len(current) + len(line) + 1 > limit:
            chunks.append(current)
            current = line
        else:
            current = current + "\n" + line if current else line
    if current:
        chunks.append(current)
    return chunks


async def _send_reply(update: Update, context: ContextTypes.DEFAULT_TYPE, text: str):
    chat_id = update.effective_chat.id
    chunks = _split_long(text)
    for i, chunk in enumerate(chunks):
        if i == 0:
            await update.message.reply_text(chunk)
        else:
            await context.bot.send_message(chat_id=chat_id, text=chunk)


async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Vision path: download photo, send to Gemini, reply with description."""
    if not is_allowed(update.effective_user.id):
        return
    if not GEMINI_KEY:
        await update.message.reply_text("⚠️ Vision is not configured (missing GEMINI_API_KEY).")
        return

    chat_id = update.effective_chat.id
    await context.bot.send_chat_action(chat_id=chat_id, action="typing")

    caption = (update.message.caption or "").strip()
    question = caption or "Describe this image in detail."

    try:
        photo = update.message.photo[-1]
        file = await photo.get_file()
        image_bytes = await file.download_as_bytearray()
        b64 = base64.b64encode(bytes(image_bytes)).decode("ascii")

        payload = {
            "contents": [{
                "parts": [
                    {"text": question},
                    {"inline_data": {"mime_type": "image/jpeg", "data": b64}},
                ]
            }]
        }
        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{GEMINI_MODEL}:generateContent?key={GEMINI_KEY}"
        )
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            data = resp.json()

        text = ""
        try:
            text = data["candidates"][0]["content"]["parts"][0]["text"]
        except (KeyError, IndexError):
            text = "(No text returned — image may have been blocked or empty.)"

        await _send_reply(update, context, text.strip() or "(empty response)")

    except httpx.HTTPStatusError as e:
        await update.message.reply_text(f"❌ Vision error: {e.response.text[:200]}")
    except Exception as e:
        await update.message.reply_text(f"❌ Error processing image: {str(e)[:200]}")


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Text path: forward to Hermes oneshot (-z)."""
    user = update.effective_user
    if not is_allowed(user.id):
        return

    message_text = update.message.text or ""
    if not message_text.strip():
        return

    me = context.bot.username
    if me:
        message_text = message_text.replace(f"@{me}", "").strip()
    if not message_text:
        return

    chat_id = update.effective_chat.id
    await context.bot.send_chat_action(chat_id=chat_id, action="typing")

    cmd = [HERMES_BIN, "-z", message_text]
    env = os.environ.copy()
    env["HOME"] = "/root"

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=env,
            cwd="/root",
        )
        try:
            stdout, _stderr = await asyncio.wait_for(proc.communicate(), timeout=120)
        except asyncio.TimeoutError:
            proc.kill()
            await update.message.reply_text("⏰ Request timed out. Please try a simpler question.")
            return

        response = stdout.decode("utf-8", errors="replace").strip()
        if not response:
            response = "I received an empty response. Please try again."

        await _send_reply(update, context, response)

    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)[:200]}")


def main():
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("reset", reset_command))
    app.add_handler(MessageHandler(filters.PHOTO, handle_photo))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
