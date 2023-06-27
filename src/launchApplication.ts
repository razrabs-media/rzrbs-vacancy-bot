import { message } from "telegraf/filters";

import "./connectToDatabase";
import { BotCommandDescription, BotCommands } from "./constants/actions";
import bot from "./launchBot";
import PublishQueueItemModel from "./schemas/publish_queue";
import VacancyModel from "./schemas/vacancy";
import { BotService, SubscribeToActionsService, logger } from "./services";
import config from "./utils/config";

VacancyModel.sync();
PublishQueueItemModel.sync();

// catches any bot errors
bot.catch(BotService.handleErrors);

bot.start(async (ctx) => {
  const welcomeText =
    `Привет! Это бот размещения вакансий в @razrabsjobs.\n` +
    `Достаточно отправить текст, чтобы я сформировал объявление, ` +
    `но убедись в наличии необходимых полей, ` +
    `указанных в шаблоне (/template) — я проверяю каждое сообщение.\n` +
    `\n` +
    `Разместить бесплатно можно до ${config.monthVacancyLimit} ` +
    `сообщений в месяц. Я считаю по количеству объявлений от тебя и ` +
    `указананной компании. Для размещения большего ` +
    `числа вакансий, другому виду сотрудничества или, в случае ` +
    `возникновения проблем в работе со мной, — напиши админу канала.`;

  await ctx.reply(welcomeText);
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
const timerId = SubscribeToActionsService.subscribeToPublishQueueMonitoring();

bot.launch();
logger.info("Bot is listening...");

// Enable graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  BotService.gracefulShutdown({
    publishQueueTimerId: timerId,
  });
});

process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
  BotService.gracefulShutdown({
    publishQueueTimerId: timerId,
  });
});
