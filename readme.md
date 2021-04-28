# telegram-ytdl

#### A simple, fast and bandwidth-conserving YouTube download bot.

[![Telegram Bot](https://img.shields.io/badge/TELEGRAM-BOT-%2330A3E6?style=for-the-badge&logo=telegram)](https://t.me/vYTDL_bot)
![GitHub top language](https://img.shields.io/github/languages/top/vaaski/telegram-ytdl?style=for-the-badge)

---

I was never satisfied with any YouTube downloader solution, because they either required chasing some website that was
either bloated with ads, painfully slow, taken down the next day or all of those combined.
Using [youtube-dl](https://github.com/ytdl-org/youtube-dl) in the command line was my go-to,
but doesn't really work great on mobile.

#### So I made this bot, to have the videos right where I'd send them anyway, fast and effortless.

It uses [ytdl-core](https://github.com/fent/node-ytdl-core) under the hood to get the stream URL of YouTube videos,
because from my testing it proved substantially faster then [youtube-dl](https://github.com/ytdl-org/youtube-dl).
The bot then gives the highest-quality stream URL that combines audio and video (usually 720p) and gives it directly to
telegram, so that it's never downloaded to my server, which greatly improves speed.

TikTok support was also added using [youtube-dl](https://github.com/fent/node-ytdl-core).

## usage

This is designed to be as easy and fast as possible: **Just send a YouTube or TikTok link to the bot.**

Thats it!

## contributing

I am open to contributions. Just clone the repo and run two commands to get started:

```sh
npm ci # installs the dependencies exactly as defined in the lockfile
```

and

```sh
npm run dev # runs nodemon with node-ts and dotenv, with debugging enabled
```

Make sure to include your bot credentials in the .env file or as environment variables.
