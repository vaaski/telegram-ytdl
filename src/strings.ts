/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { bold } from "./util"

const strings = {
  start: (name: string) =>
    `hello ${name}\n\njust send me a <b>youtube</b> link and i'll give you the choice of downloading it as video or audio.`,
  startDescription: () => `send the welcome message again`,
  unsupported: () => `sorry, i don't know how to download that yet.`,
  formatSelection: (video?: string) =>
    `download${video ? " " + bold(video) : ""} as audio or video?`,
  downloading: (add?: string) => `downloading${add ? " " + add : ""}...`,
  error: (add?: string) => `sorry, something went wrong.` + (add ? "\n\n" + add : ""),
  overSize: (type: string, url: string) =>
    `unfortunately, telegram bots can only upload files up to 50MB, and your ${type} is larger than that.\n` +
    `please visit the link and ` +
    `${bold("long-press")} or ${bold("right-click")} ` +
    `and select ${bold("download")} or ${bold("save as")}\n\n` +
    `${url}`,
}

export default strings
