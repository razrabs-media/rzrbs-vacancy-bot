import { message } from "telegraf/filters";

import "./connectToDatabase";
import { BotCommandDescription, BotCommands } from "./constants/actions";
import { welcomeMessageText } from "./constants/messages";
import bot from "./launchBot";
import PublishQueueItemModel from "./schemas/publish_queue";
import VacancyModel from "./schemas/vacancy";
import { BotService, SubscribeToActionsService, logger } from "./services";

VacancyModel.sync();
PublishQueueItemModel.sync();

// catches any bot errors
bot.catch(BotService.handleErrors);

bot.start(async (ctx) => {
  await ctx.reply(welcomeMessageText);
  await ctx.setChatMenuButton({ type: "commands" });
});

bot.telegram.setMyCommands([
  {
    command: BotCommands.Template,
    description: BotCommandDescription[BotCommands.Template],
  },
]);

SubscribeToActionsService.subscribeToCommands();

bot.on(message("text"), SubscribeToActionsService.subscribeToTextMessage);

SubscribeToActionsService.subscribeToButtonActions();
SubscribeToActionsService.subscribeToPublishQueueMonitoring();

bot.launch();
logger.info("Bot is listening...");

// Enable graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  BotService.gracefulShutdown();
});

process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
  BotService.gracefulShutdown();
});
