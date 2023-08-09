import { PublishQueueService } from "../services";
import config from "./config";
import { getTwoWeeksDaysArray } from "./getTwoWeeksDaysArray";

export const isPublishingAllowedDuringTwoWeeks = async (): Promise<boolean> => {
  const twoWeeks = getTwoWeeksDaysArray();
  const publishQueueLength = await PublishQueueService.getPublishQueueLength();
  const publishInterval =
    await PublishQueueService.countPublishIntervalForVacanciesPool();
  const publishSchedule = config.publishConfig.schedule;

  let vacanciesInQueueRemained = publishQueueLength;
  for (const weekDay of twoWeeks) {
    if (!publishSchedule[weekDay]) {
      continue;
    }
    const [from, to] = publishSchedule[weekDay];
    const vacanciesAvailableToPublish = Math.ceil(
      (to - from) / publishInterval
    );

    if (vacanciesInQueueRemained - vacanciesAvailableToPublish <= 0) {
      return true;
    }
    vacanciesInQueueRemained -= vacanciesAvailableToPublish;
  }
  return false;
};
