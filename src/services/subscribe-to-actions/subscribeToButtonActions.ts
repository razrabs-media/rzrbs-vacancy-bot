import { Telegraf } from "telegraf";
import { BotContext } from "../../types/context";
import {
  PublishVacancyService,
  RevokeVacancyService,
  CancelVacancyService,
} from "../index";
import { BotActions } from "../../constants/actions";

export const subscribeToButtonActions = (bot: Telegraf<BotContext>) => {
  bot.action(BotActions.PublishVacancy, PublishVacancyService.onPublishVacancy);
  bot.action(BotActions.RevokeVacancy, RevokeVacancyService.onVacancyRevoke);
  bot.action(BotActions.CancelVacancy, CancelVacancyService.onVacancyCancel);
};
