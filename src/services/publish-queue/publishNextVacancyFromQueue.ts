import PublishQueueItemModel from "../../schemas/publish_queue";
import config from "../../utils/config";
import { getTodayWeekDay } from "../../utils/getTodayWeekDay";
import { isVacancyPublishingAllowedToday } from "../../utils/isVacancyPublishingAllowedToday";
import { clearDailyPublishInterval } from "../../utils/publishInterval";
import { getCurrentHours } from "../../utils/time";
import { handleLogging } from "../logger";
import { publishVacancyToChannels } from "../publish-vacancy/publishVacancyToChannels";

export const publishNextVacancyFromQueue = async () => {
  const { logInfo, logError } = handleLogging(
    "Publish Next Vacancy",
    undefined,
    "failed to publish next vacancy"
  );

  try {
    const currentHour = getCurrentHours();
    const currentWeekDay = getTodayWeekDay();
    const [, to] = config.publishConfig.schedule[currentWeekDay] || [];

    if (currentHour >= to) {
      clearDailyPublishInterval();
      logInfo("working day finished");
    }

    const isPublishingAllowed = await isVacancyPublishingAllowedToday();
    if (!isPublishingAllowed) {
      logInfo(
        `canceled, because daily limit reached ${config.publishConfig.dailyVacancyLimit}`
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
      logInfo("nothing found to publish");
    } else {
      await publishVacancyToChannels(publishQueueItem);
    }
  } catch (err) {
    logError(err);
  }
};
