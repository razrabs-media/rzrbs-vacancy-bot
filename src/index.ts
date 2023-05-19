import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import mongoose from "mongoose";

import { BotContext } from "./types/context";
import { MessagePreviewService, SubscribeToActionsService } from "./services";

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw Error("Failed to start, BOT_TOKEN is missing");
}

if (!process.env.DB_URL) {
  throw Error("Failed to start, DB_URL is missing");
}

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    throw Error(`Failed to connect to DB - ${err}`);
  });

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Hello World"));

bot.on(message("text"), async (ctx) => {
  ctx.state.user = ctx.message.from;

  // for debug purposes for now :)
  console.log(ctx.message);
  console.log(ctx.telegram);
  console.log(ctx.state);

  // here we generate vacancy text from message somehow

  await MessagePreviewService.sendMessagePreview(
    ctx /* , parsedVacancyObject: Omit<IVacancy, "tg_message_id"> */
  );
});

SubscribeToActionsService.subscribeToButtonActions(bot);
const timerId = SubscribeToActionsService.subscribeToPublishQueue();

bot.launch();
console.log("Bot is listening...");

// Enable graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
  clearInterval(timerId);
});
process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
  clearInterval(timerId);
});
