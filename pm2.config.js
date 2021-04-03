module.exports = {
  apps: [
    {
      script: "./build/index.js",
      name: "telegram-ytdl",
      node_args: "-r dotenv/config",
    },
  ],
}
