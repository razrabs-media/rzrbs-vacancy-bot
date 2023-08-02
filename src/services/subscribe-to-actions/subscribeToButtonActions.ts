import { BotActions } from "../../constants/actions";
import bot from "../../launchBot";
import {
  CancelVacancyService,
  MessagePreviewService,
  PublishVacancyService,
  RevokeVacancyService,
} from "../index";

const RETRY_PARSING_REGEXP = new RegExp(`^${BotActions.RetryParsing}-(.+)$`);

export const subscribeToButtonActions = () => {
  bot.action(BotActions.PublishVacancy, PublishVacancyService.onPublishVacancy);
  bot.action(BotActions.RevokeVacancy, RevokeVacancyService.onVacancyRevoke);
  bot.action(BotActions.CancelVacancy, CancelVacancyService.onVacancyCancel);
  bot.action(RETRY_PARSING_REGEXP, MessagePreviewService.onRetryParsing);
};
