import { bold, link } from "./botutil"

export const deniedMessage = [
  bold("This bot is now private."),
  "",
  "People have been using it to download Russian propaganda and overall mostly cringy shit and I won't keep paying for servers to support that.",
  "",
  bold(
    // biome-ignore lint/style/useTemplate: line length
    `As an alternative I recommend checking out ${link("yt-dlp", "https://github.com/yt-dlp/yt-dlp")}, ` +
      `the command line tool that powers this bot or ${link("go-yt-dlp", "https://github.com/vaaski/go-yt-dlp")}, ` +
      "a simplified wrapper I built for yt-dlp."
  ),
  "",
  `${bold("Do not")} try to contact me to get whitelisted, I will no longer accept anyone I don't know personally.`,
].join("\n")
