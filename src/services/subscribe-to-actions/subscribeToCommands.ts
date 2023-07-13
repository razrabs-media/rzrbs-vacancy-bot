import { BotService } from "..";
import { BotCommands } from "../../constants/actions";
import bot from "../../launchBot";

export const subscribeToCommands = () => {
  bot.command(BotCommands.Template, BotService.sendVacancyTemplateMessage);
  bot.command(BotCommands.Help, BotService.sendHelpMessage);
};
