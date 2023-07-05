import PublishQueueItemModel from "../../../schemas/publish_queue";
import logger from "../../logger";

export const getPublishQueueLength = async (): Promise<number> => {
  try {
    const { count: publishQueueItemsAmount } =
      await PublishQueueItemModel.findAndCountAll({
        where: {
          published: false,
          removed: false,
        },
      });

    if (!publishQueueItemsAmount) {
      logger.info(`Publish queue is empty`);
      return 0;
    }
    logger.info(
      `Publish queue - ${publishQueueItemsAmount} vacancies are waiting to be published`
    );
    return publishQueueItemsAmount;
  } catch (err) {
    logger.error(
      `Failed to fetch publish queue items - ${
        (err as Error).message || JSON.stringify(err)
      }`
    );
    return 0;
  }
};
