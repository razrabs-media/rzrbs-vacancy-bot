import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { BotContext } from "./types/context";
import {
  BotService,
  MessagePreviewService,
  SubscribeToActionsService,
  logger,
} from "./services";

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN!);

// catches any bot errors
bot.catch((err) => {
  logger.error(`Something went wrong: ${JSON.stringify(err)}`);
});

// TODO: add welcome text here
bot.start((ctx) => ctx.reply("Hello World"));

bot.on(message("text"), async (ctx) => {
  ctx.state.user = ctx.message.from;

  // for debug purposes for now :)
  logger.info(ctx.message);
  logger.info(ctx.telegram);
  logger.info(ctx.state);

  // here we generate vacancy text from message somehow

  await MessagePreviewService.sendMessagePreview(
    ctx /* , parsedVacancyObject: IVacancyParsed */
  );
});

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
