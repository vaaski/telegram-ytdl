# telegram-ytdl

#### A simple & fast YouTube download Telegram bot.

[![Telegram Bot](https://img.shields.io/badge/TELEGRAM-BOT-%2330A3E6?style=for-the-badge&logo=telegram)](https://t.me/vYTDL_bot)
![GitHub top language](https://img.shields.io/github/languages/top/vaaski/telegram-ytdl?style=for-the-badge)

## Synopsis

I was never satisfied with any YouTube downloader solution, because they either required chasing some website that was
either bloated with ads, painfully slow, taken down the next day or all of those combined.
Using [yt-dlp][yt-dlp] in the command line was my go-to,
but doesn't really work great on mobile.

**So I made this bot, to download from a single place across platforms, fast and effortless.**

The bot then simply passes the URL to [yt-dlp][yt-dlp] with the `-f b` flag, which downloads the best quality
format that contains both video and audio. This is meant to work together with a self-hosted
Telegram bot API server, so that the upload limit for bots is increased from 50MB to 2GB.

Because content sites change often (especially TikTok!), the bot uses the nightly build of yt-dlp to
always get the latest resolvers. It will also auto-update yt-dlp every night as long as you don't
set `YTDL_AUTOUPDATE` to `"false"`.

The instance hosted by me is no longer available for public use, but you can simply host your own instance.

## Hosting

To host your own instance of this bot, you need to have a Telegram bot token, Telegram API Token
and a server to run the bot on. You can create a Telegram bot with [BotFather][botfather] and purchase
a cheap VPS with the hoster of your choice.

I recommend [Hetzner][hetzner] and you can get 20€ in credits for free using my [referral link][hetzner].

### Installation

- [Install Docker](https://docs.docker.com/engine/install)
- Create a folder and put the [compose.yml](./compose.yml) into it.
- Fill out and adjust the following variables in the docker-compose.yml file:

  | Variable                | Description                                                                                                                                    |
  | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
  | `TELEGRAM_BOT_TOKEN`    | Your Telegram bot token (get it from [BotFather][botfather])                                                                                   |
  | `WHITELISTED_IDS`       | A comma-separated list of Telegram user IDs that are allowed to use the bot (get them from [this bot][id-bot]), leave empty to allow all users |
  | `ADMIN_ID`              | Your Telegram user ID (get it from [this bot][id-bot])                                                                                         |
  | `TELEGRAM_API_ID`       | Your Telegram API ID (get it [here][telegram-api-id])                                                                                          |
  | `TELEGRAM_API_HASH`     | Your Telegram API hash (get it [here][telegram-api-id])                                                                                        |
  | `TELEGRAM_API_ROOT`     | The URL of your Telegram bot API server (can probably be left unchanged)                                                                       |
  | `TELEGRAM_WEBHOOK_PORT` | The port the bot will listen on (can probably be left unchanged)                                                                               |
  | `TELEGRAM_WEBHOOK_URL`  | The URL of your Telegram bot API server (can probably be left unchanged)                                                                       |
  | `YTDL_AUTOUPDATE`       | Whether to automatically update yt-dlp (defaults to `"true"`, set to `"false"` to disable)                                                     |
  | `OPENAI_API_KEY`        | Your OpenAI API key (optional, used for auto-translation)                                                                                      |

- Run `docker compose up -d` in the folder you created.

If you have any problems with hosting feel free to contact me or open an issue.

[yt-dlp]: https://github.com/yt-dlp/yt-dlp
[telegram-api-id]: https://core.telegram.org/api/obtaining_api_id
[id-bot]: https://t.me/getidsbot
[botfather]: https://t.me/BotFather
[hetzner]: https://hetzner.cloud/?ref=e5ntAQJVvxX1
