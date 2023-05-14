export declare global {
  namespace NodeJS {
    // eslint-disable-next-line unicorn/prevent-abbreviations
    interface ProcessEnv {
      BOT_TOKEN?: string
      POCKETBASE_ADDR?: string
    }
  }
}
