import { Telegraf } from "telegraf";
import { BotContext } from "../../types/context";
import { BotService } from "..";
import { BotCommands } from "../../constants/actions";

export const subscribeToCommands = (bot: Telegraf<BotContext>) => {
  bot.command(BotCommands.Template, BotService.sendVacancyTemplateMessage);
};
