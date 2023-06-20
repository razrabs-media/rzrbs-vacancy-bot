import { logger } from "../index";
import PublishQueueItemModel from "../../schemas/publish_queue";

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
      const publishQueueItems = await PublishQueueItemModel.findAll({
        where: {
          published: false,
          removed: false,
        },
      });

      if (!publishQueueItems.length) {
        logger.info(`Publish queue is empty`);
      } else {
        logger.info(
          `Publish queue - ${publishQueueItems.length} vacancies are waiting to be published`
        );
        // TODO: add publish logic
        // https://github.com/openworld-community/rzrbs-vacancy-bot/issues/13
      }
    } catch (err) {
      logger.error(
        `Failed to fetch publish queue items - ${
          (err as Error).message || JSON.stringify(err)
        }`
      );
    }
    // PUBLISH_INTERVAL hours
  }, 1000 * 60 * 60 * Number(process.env.PUBLISH_INTERVAL));
};
