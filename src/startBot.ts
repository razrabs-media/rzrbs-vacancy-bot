import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { BotContext } from "./types/context";
import { BotService, SubscribeToActionsService, logger } from "./services";
import { BotCommandDescription, BotCommands } from "./constants/actions";

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN!);

// catches any bot errors
bot.catch(BotService.handleErrors);

bot.start(async (ctx) => {
  // TODO: add welcome text here
  await ctx.reply("Hello World");
  await ctx.setChatMenuButton({ type: "default" });
});

bot.telegram.setMyCommands([
  {
    command: BotCommands.Template,
    description: BotCommandDescription[BotCommands.Template],
  },
]);

SubscribeToActionsService.subscribeToCommands(bot);

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
