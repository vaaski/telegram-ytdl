import { bot } from "./setup"
import { bold, link } from "./textutil"

bot.use(async (ctx, next) => {
  if (ctx.chat?.type !== "private") return

  await next()
})

bot.on("message:text", async (ctx) => {
  await ctx.replyWithHTML(
    [
      bold("The Bot is currently down for maintenance."),
      "",
      `In the meantime, I recommend checking out ${link("yt-dlp", "https://github.com/yt-dlp/yt-dlp")}, the command line tool that powers this bot.`,
    ].join("\n"),
    {
      link_preview_options: { is_disabled: true },
    }
  )
})
