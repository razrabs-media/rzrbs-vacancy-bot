import { Telegraf } from "telegraf";

import { BotContext } from "./types/context";
import config from "./utils/config";

if (!config.botToken) {
  throw Error("Failed to start, BOT_TOKEN is missing");
}

const bot = new Telegraf<BotContext>(config.botToken);

export default bot;
