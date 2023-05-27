import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { BotContext } from "./types/context";
import { BotService, SubscribeToActionsService, logger } from "./services";

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN!);

// catches any bot errors
bot.catch(BotService.handleErrors);

// TODO: add welcome text here
bot.start((ctx) => ctx.reply("Hello World"));

bot.on(message("text"), SubscribeToActionsService.subscribeToTextMessage);

SubscribeToActionsService.subscribeToButtonActions(bot);
const timerId = SubscribeToActionsService.subscribeToPublishQueueMonitoring();

bot.launch();
logger.info("Bot is listening...");

// Enable graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  BotService.gracefulShutdown({ publishQueueTimerId: timerId });
});
process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
  BotService.gracefulShutdown({ publishQueueTimerId: timerId });
});
