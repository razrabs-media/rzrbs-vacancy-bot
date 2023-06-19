import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { BotContext } from "./types/context";
import { BotService, SubscribeToActionsService, logger } from "./services";
import { BotCommandDescription, BotCommands } from "./constants/actions";

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN!);

// catches any bot errors
bot.catch(BotService.handleErrors);

bot.start(async (ctx) => {
  const welcomeText =
    `Привет! Это бот размещения вакансий в @razrabsjobs.\n` +
    `Достаточно отправить текст, чтобы я сформировал объявление, ` +
    `но убедись в наличии необходимых полей, ` +
    `указанных в шаблоне (/template) — я проверяю каждое сообщение.\n` +
    `\n` +
    `Разместить бесплатно можно до ${process.env.MONTH_VACANCY_LIMIT} ` +
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
