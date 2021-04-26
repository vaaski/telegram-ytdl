/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const strings = {
  start: (name: string) =>
    `hello ${name}\n\njust send me a <b>youtube</b> link and i'll give you the choice of downloading it as video or audio.`,
  startDescription: () => `send the welcome message again`,
  unsupported: () => `sorry, i don't know how to download that yet.`,
  formatSelection: (video: string) => `download "${video}" as audio or video?`,
  downloading: (add?: string) => `downloading${add ? " " : ""}${add}...`,
}

export default strings
