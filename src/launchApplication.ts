import "./connectToDatabase";
import { BotCommandDescription, BotCommands } from "./constants/actions";
import { welcomeMessageText } from "./constants/messages";
import bot from "./launchBot";
import PublishQueueItemModel from "./schemas/publish_queue";
import VacancyModel from "./schemas/vacancy";
import { BotService, SubscribeToActionsService, logger } from "./services";
import { Environment } from "./types/common";
import config from "./utils/config";

if (!config.aiApiKey || !config.aiOrganizationId) {
  throw Error("You must provide OPENAI_ORGANIZATION_ID and OPENAI_API_KEY");
}

if (!config.botConsultantUsername) {
  logger.warn("Variable BOT_CONSULTANT_USERNAME is missing");
}

VacancyModel.sync({ alter: config.environment !== Environment.Prod });
PublishQueueItemModel.sync({ alter: config.environment !== Environment.Prod });

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
  {
    command: BotCommands.Help,
    description: BotCommandDescription[BotCommands.Help],
  },
]);

SubscribeToActionsService.subscribeToCommands();
SubscribeToActionsService.subscribeToTextMessage();
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
