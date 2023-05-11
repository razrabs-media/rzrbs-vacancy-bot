import { Telegraf } from "telegraf";
import { BotContext } from "../../types/context";
import {
  EditMessageService,
  PublishVacancyService,
  DeclineVacancyService,
} from "../index";
import { BotActions } from "../../constants/actions";

export const subscribeToButtonActions = (bot: Telegraf<BotContext>) => {
  bot.action(BotActions.EditMessage, EditMessageService.onMessageEdit);
  bot.action(BotActions.PublishVacancy, PublishVacancyService.onPublishVacancy);
  bot.action(BotActions.DeclineVacancy, DeclineVacancyService.onVacancyDecline);
};
