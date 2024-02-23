import { bold, link } from "./botutil"

export const deniedMessage = [
  bold("This bot is now private."),
  "",
  "People have been using it to download Russian propaganda and overall mostly cringy shit and I won't keep paying for servers to support that.",
  "",
  bold(
    `As an alternative I recommend checking out ${link("yt-dlp", "https://github.com/yt-dlp/yt-dlp")}, ` +
      `the command line tool that powers this bot or ${link("go-yt-dlp", "https://github.com/vaaski/go-yt-dlp")}, ` +
      `a simplified wrapper I built for yt-dlp.`
  ),
  "",
  "If you think you don't fit into the group of people mentioned above, you can contact @vaaski to get whitelisted.",
].join("\n")
