import PublishQueueItemModel from "../../schemas/publish_queue";
import { IPublishQueueItem } from "../../types/publish_queue";
import { handleLogging } from "../logger";

export const getPublishQueueItems = async (): Promise<IPublishQueueItem[]> => {
  const { logInfo, logError } = handleLogging(
    "getPublishQueueItems",
    undefined,
    "Failed to fetch publish queue items"
  );
  try {
    const publishQueueItems = await PublishQueueItemModel.findAll({
      where: {
        published: false,
        removed: false,
      },
    });

    if (!publishQueueItems?.length) {
      logInfo(`Publish queue is empty`);
      return [];
    }

    return publishQueueItems;
  } catch (err) {
    logError(err);
    return [];
  }
};
