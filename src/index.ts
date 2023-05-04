import dotenv from "dotenv";
import { Telegraf, Context } from "telegraf";
import { message } from "telegraf/filters";

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw Error("Failed to start, BOT_TOKEN is missing");
}

// mock type for now
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BotContext extends Context {}

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("Hello World"));

bot.on(message("text"), async (ctx) => {
  ctx.state.user = ctx.message.from;

  // for debug purposes for now :)
  console.log(ctx.message);
  console.log(ctx.telegram);
  console.log(ctx.state);

  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hello ${ctx.message.from.username}`
  );
});

bot.launch();
console.log("Bot is listening...");

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
