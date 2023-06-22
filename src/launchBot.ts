import config from "./utils/config";

if (!config.botToken) {
  throw Error("Failed to start, BOT_TOKEN is missing");
}

import { Telegraf } from "telegraf";
import { BotContext } from "./types/context";

const bot = new Telegraf<BotContext>(config.botToken);

export default bot;
