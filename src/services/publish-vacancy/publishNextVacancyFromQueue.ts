import PublishQueueItemModel from "../../schemas/publish_queue";
import config from "../../utils/config";
import { clearDailyPublishInterval } from "../../utils/dailyPublishInterval";
import { getTodayWeekDay } from "../../utils/getTodayWeekDay";
import logger from "../logger";
import { publishVacancyToChannels } from "./publishVacancyToChannels";

export const publishNextVacancyFromQueue = async () => {
  const currentHour = new Date().getHours();
  const currentWeekDay = getTodayWeekDay();
  const [, to] = config.publishConfig.schedule[currentWeekDay] || [];

  const [publishQueueItem] = await PublishQueueItemModel.findAll({
    where: {
      published: false,
      removed: false,
    },
    order: [["createdAt", "ASC"]],
    limit: 1,
  });

  if (!publishQueueItem) {
    logger.info("Publish Queue: nothing found to publish");
  } else {
    await publishVacancyToChannels(publishQueueItem);
  }

  if (currentHour >= to) {
    clearDailyPublishInterval();
  }
};
