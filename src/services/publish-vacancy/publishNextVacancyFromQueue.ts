import PublishQueueItemModel from "../../schemas/publish_queue";
import config from "../../utils/config";
import { getTodayWeekDay } from "../../utils/getTodayWeekDay";
import { isVacancyPublishingAllowedToday } from "../../utils/isVacancyPublishingAllowedToday";
import { clearDailyPublishInterval } from "../../utils/publishInterval";
import { getCurrentHours } from "../../utils/time";
import logger from "../logger";
import { publishVacancyToChannels } from "./publishVacancyToChannels";

export const publishNextVacancyFromQueue = async () => {
  try {
    const currentHour = getCurrentHours();
    const currentWeekDay = getTodayWeekDay();
    const [, to] = config.publishConfig.schedule[currentWeekDay] || [];

    if (currentHour >= to) {
      clearDailyPublishInterval();
      logger.info("Publish Queue: working day finished");
    }

    const isPublishingAllowed = await isVacancyPublishingAllowedToday();
    if (!isPublishingAllowed) {
      logger.info(
        `Publish Next Vacancy: canceled, because daily limit reached ${config.publishConfig.dailyVacancyLimit}`
      );
      return;
    }

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
  } catch (err) {
    logger.error(
      `Publish Next Vacancy: failed to publish next vacancy - ${
        (err as Error)?.message || JSON.stringify(err)
      }`
    );
  }
};
