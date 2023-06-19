import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

dotenv.config();

import { BotContext } from "./types/context";
import { BotService, SubscribeToActionsService, logger } from "./services";
import { BotCommandDescription, BotCommands } from "./constants/actions";
import VacancyModel from "./schemas/vacancy";
import PublishQueueItemModel from "./schemas/publish_queue";
import ContactModel from "./schemas/contact";
import { ChatType } from "./types/bot_contact";
import config from "./utils/config";

if (!config.botToken) {
  throw Error("Failed to start, BOT_TOKEN is missing");
}

import "./connectToDatabase";

VacancyModel.sync();
PublishQueueItemModel.sync();
ContactModel.sync();

const bot = new Telegraf<BotContext>(config.botToken);

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

SubscribeToActionsService.subscribeToCommands(bot);

bot.on(message("text"), SubscribeToActionsService.subscribeToTextMessage);

bot.on("channel_post", async (ctx) => {
  const { id, title, type } = ctx?.update?.channel_post?.chat || {};

  await BotService.addToContacts({
    id: id.toString(),
    title,
    type: type as ChatType,
  });
});

SubscribeToActionsService.subscribeToButtonActions(bot);
const timerId =
  SubscribeToActionsService.subscribeToPublishQueueMonitoring(bot);

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
