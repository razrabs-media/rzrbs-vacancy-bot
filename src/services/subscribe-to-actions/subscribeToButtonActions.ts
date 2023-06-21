import {
  PublishVacancyService,
  RevokeVacancyService,
  CancelVacancyService,
} from "../index";
import { BotActions } from "../../constants/actions";
import bot from "../../launchBot";

export const subscribeToButtonActions = () => {
  bot.action(BotActions.PublishVacancy, PublishVacancyService.onPublishVacancy);
  bot.action(BotActions.RevokeVacancy, RevokeVacancyService.onVacancyRevoke);
  bot.action(BotActions.CancelVacancy, CancelVacancyService.onVacancyCancel);
};
