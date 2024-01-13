import { bot } from "./bot"
import { bold } from "./textutil"

bot.on("message:text", async (ctx) => {
  if (ctx.chat.type !== "private") return

  await ctx.replyWithHTML(
    [
      bold("The Bot is currently down for maintenance."),
      "",
      "In the meantime, I recommend checking out yt-dlp, the command line tool that powers this bot.",
      "github.com/yt-dlp/yt-dlp",
    ].join("\n"),
    {
      link_preview_options: { is_disabled: true },
    }
  )
})

console.log("Starting bot...")
bot.start()
