# Hermes Telegram Bridge

A lightweight Telegram bot that bridges messages to [Hermes Agent](https://github.com/NousResearch/hermes-agent), with a clean response format and built-in image understanding.

Built as a workaround for Hermes Agent's Telegram gateway hang ([issue #63309](https://github.com/NousResearch/hermes-agent/issues/63309)), which freezes at `Connecting to Telegram (attempt 1/8)` on many VPS environments.

## Why this exists

Hermes ships a built-in "gateway" that connects it to Telegram. On many VPS environments it hangs during initialization and never connects. This bridge bypasses the broken gateway and talks to Telegram directly, then shells out to Hermes for text answers and to Gemini for image understanding.

## Features

- **Clean text replies** — uses `hermes -z` (oneshot mode) so the reply is *only* the answer, no query echo, no model warnings, no box borders.
- **Image understanding** — send a photo and it's described by Gemini (multimodal). DeepSeek and most text-only models reject images, so vision is routed to Gemini separately.
- **Caption-as-question** — send a photo with a caption like "extract the carpet areas" and the caption becomes the prompt.
- **Authorized users** — restrict access by Telegram user ID (or allow all).
- **Auto-restart** — ships with a systemd unit for 24/7 operation.

## Requirements

- Python 3.10+
- A running Hermes Agent install (`hermes` on PATH)
- A Telegram bot token from [@BotFather](https://t.me/BotFather)
- (For vision) A Google AI API key from [Google AI Studio](https://aistudio.google.com/app/apikey) — free tier

## Installation

```bash
# 1. Install dependencies
pip install "python-telegram-bot>=21" httpx

# 2. Copy the script
sudo cp telegram_bridge.py /opt/telegram_bridge.py

# 3. Configure environment (see sample.env)
sudo cp sample.env /etc/hermes-bridge.env
sudo nano /etc/hermes-bridge.env   # fill in your token + key

# 4. Install the systemd service
sudo cp hermes-bridge.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now hermes-bridge
```

Or run it directly:

```bash
export TELEGRAM_BOT_TOKEN="123456:ABC..."
export GEMINI_API_KEY="your-google-ai-key"   # optional, for vision
python3 telegram_bridge.py
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ | Bot token from @BotFather |
| `GEMINI_API_KEY` | ❌ | Google AI key for image understanding |
| `GEMINI_MODEL` | ❌ | Gemini model (default: `gemini-3.5-flash`) |
| `HERMES_BIN` | ❌ | Path to Hermes CLI (default: `/usr/local/bin/hermes`) |
| `TELEGRAM_ALLOWED_USERS` | ❌ | Comma-separated user IDs, or `*` for everyone |

## How it works

```
Telegram ──> bridge ──> is it a photo?
                          ├── no  ──> hermes -z "question" ──> text answer
                          └── yes ──> Gemini (vision) ────────> description
```

## Security

- No secrets are hardcoded — everything is read from environment variables.
- Never commit `.env` files or real tokens to version control.
- Keep your bot token private: anyone with it can control your bot.

## License

MIT
