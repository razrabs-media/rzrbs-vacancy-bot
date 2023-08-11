import PublishQueueItemModel from "../../schemas/publish_queue";
import { handleLogging } from "../logger";

export const getPublishQueueLength = async (): Promise<number> => {
  const { logInfo, logError } = handleLogging(
    "getPublishQueueLength",
    undefined,
    "Failed to fetch publish queue items"
  );
  try {
    const { count: publishQueueItemsAmount } =
      await PublishQueueItemModel.findAndCountAll({
        where: {
          published: false,
          removed: false,
        },
      });

    if (!publishQueueItemsAmount) {
      logInfo(`Publish queue is empty`);
      return 0;
    }
    logInfo(`${publishQueueItemsAmount} vacancies are waiting to be published`);
    return publishQueueItemsAmount;
  } catch (err) {
    logError(err);
    return 0;
  }
};
