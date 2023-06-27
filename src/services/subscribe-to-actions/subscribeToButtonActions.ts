import { BotActions } from "../../constants/actions";
import bot from "../../launchBot";
import {
  CancelVacancyService,
  PublishVacancyService,
  RevokeVacancyService,
} from "../index";

export const subscribeToButtonActions = () => {
  bot.action(BotActions.PublishVacancy, PublishVacancyService.onPublishVacancy);
  bot.action(BotActions.RevokeVacancy, RevokeVacancyService.onVacancyRevoke);
  bot.action(BotActions.CancelVacancy, CancelVacancyService.onVacancyCancel);
};
