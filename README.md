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

The instance hosted by me is no longer available for public use, but you can simply host your own instance.
Instructions are coming soon™.

[yt-dlp]: https://github.com/yt-dlp/yt-dlp