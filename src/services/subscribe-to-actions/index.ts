import { Telegraf } from "telegraf";
import { BotContext } from "../../types/context";
import {
  PublishVacancyService,
  RevokeVacancyService,
  CancelVacancyService,
  logger,
} from "../index";
import { BotActions } from "../../constants/actions";
import PublishQueueItemModel from "../../schemas/publish_queue";

export const subscribeToButtonActions = (bot: Telegraf<BotContext>) => {
  bot.action(BotActions.PublishVacancy, PublishVacancyService.onPublishVacancy);
  bot.action(BotActions.RevokeVacancy, RevokeVacancyService.onVacancyRevoke);
  bot.action(BotActions.CancelVacancy, CancelVacancyService.onVacancyCancel);
};

export const subscribeToPublishQueueMonitoring = () => {
  if (!process.env.PUBLISH_INTERVAL) {
    logger.warn("WARN: Publish queue won't work until PUBLISH_INTERVAL is set");
    return;
  }

  logger.info(
    `Subscribed to check publish queue each ${process.env.PUBLISH_INTERVAL} hours`
  );
  return setInterval(async () => {
    try {
      const publishQueueItems = await PublishQueueItemModel.find({
        published: false,
        removed: false,
      });

      if (!publishQueueItems.length) {
        logger.info(`[${Date.now()}]: Publish queue is empty`);
      } else {
        // TODO: add publish logic
      }
    } catch (err) {
      logger.error(
        `[${Date.now()}]: Failed to fetch publish queue items - ${JSON.stringify(
          err
        )}`
      );
    }
    // PUBLISH_INTERVAL hours
  }, 1000 * 60 * 60 * Number(process.env.PUBLISH_INTERVAL));
};
