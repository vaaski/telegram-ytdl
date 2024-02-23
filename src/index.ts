import { WHITELISTED_IDS } from "./environment"
import { bot } from "./setup"
import { bold, link } from "./textutil"

bot.use(async (ctx, next) => {
  if (ctx.chat?.type !== "private") return

  await next()
})

bot.on("message:text", async (ctx, next) => {
  if (WHITELISTED_IDS.includes(ctx.from?.id)) return next()

  await ctx.replyWithHTML(
    [
      bold("This bot is now private."),
      "",
      "People have been using it to download Russian propaganda and overall mostly cringy shit and I won't keep paying for servers to support that.",
      "",
      `As an alternative I recommend checking out ${link("yt-dlp", "https://github.com/yt-dlp/yt-dlp")}, ` +
        `the command line tool that powers this bot or ${link("go-yt-dlp", "https://github.com/vaaski/go-yt-dlp")}, ` +
        `a simplified wrapper I built for yt-dlp.`,
    ].join("\n"),
    {
      link_preview_options: { is_disabled: true },
    }
  )
})

bot.on("message:text").on("::url", async (ctx) => {
  await ctx.replyWithHTML("URL handler")
})

bot.on("message:text", async (ctx) => {
  await ctx.replyWithHTML("You need to send an URL to download stuff.")
})
