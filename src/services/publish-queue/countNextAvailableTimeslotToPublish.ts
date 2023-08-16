import config from "../../utils/config";
import { getRoundDate } from "../../utils/getRoundDate";
import { getTodayWeekDay } from "../../utils/getTodayWeekDay";
import { getTwoWeeksDaysArray } from "../../utils/getTwoWeeksDaysArray";
import { getCurrentHours } from "../../utils/time";
import PublishQueueError from "./PublishQueueError";
import { countPublishIntervalForVacanciesPool } from "./countPublishIntervalForVacanciesPool";
import { getNearestAvailableHour } from "./getNearestAvailableHour";
import { getPublishQueueLength } from "./getPublishQueueLength";

/**
 * Counts next available timeslot to publish vacancy from the publish queue,
 * by configured schedule and publish interval
 *
 * @returns {Date} - date and time when vacancy can be published
 */
export const countNextAvailableTimeslotToPublish = async (params?: {
  publishQueueLength: number;
}): Promise<Date> => {
  const publishInterval = await countPublishIntervalForVacanciesPool();
  const publishQueueLength =
    params?.publishQueueLength || (await getPublishQueueLength());
  const publishSchedule = config.publishConfig.schedule;
  const twoWeeksDays = getTwoWeeksDaysArray();
  const todayWeekDay = getTodayWeekDay();
  const currentHour = getCurrentHours();

  if (!publishQueueLength) {
    return getRoundDate({
      hour: getNearestAvailableHour(
        currentHour,
        publishSchedule[todayWeekDay],
        publishInterval
      ),
    });
  }

  const [todayFrom, todayTo] = publishSchedule[todayWeekDay] || [];

  // if today is day off or work day is over
  if (!publishSchedule[todayWeekDay] || currentHour > todayTo) {
    twoWeeksDays.shift();
  }

  let vacanciesInQueueRemained = publishQueueLength;

  // if working day is in progress
  if (currentHour >= todayFrom && currentHour <= todayTo) {
    const nearestAvailableHour = getNearestAvailableHour(
      currentHour,
      publishSchedule[todayWeekDay],
      publishInterval
    );
    const hoursRemained = todayTo - nearestAvailableHour;
    const vacanciesAvailableToPublish = Math.ceil(
      hoursRemained / publishInterval
    );

    // we can publish all the queue today
    if (vacanciesAvailableToPublish >= publishQueueLength) {
      return getRoundDate({
        hour: nearestAvailableHour + publishQueueLength * publishInterval,
      });
    } else {
      vacanciesInQueueRemained -= vacanciesAvailableToPublish;
      twoWeeksDays.shift();
    }
  }

  let daysToWait = 0;

  for (const weekDay of twoWeeksDays) {
    if (!publishSchedule[weekDay]) {
      daysToWait++;
      continue;
    }

    const [from, to] = publishSchedule[weekDay];
    const vacanciesAvailableToPublish = Math.ceil(
      (to - from) / publishInterval
    );

    if (vacanciesInQueueRemained <= vacanciesAvailableToPublish) {
      const nearestAvailableHour = getNearestAvailableHour(
        from + publishInterval * vacanciesInQueueRemained - 1,
        publishSchedule[weekDay],
        publishInterval
      );
      return getRoundDate({
        hour: nearestAvailableHour,
        daysToAdd: daysToWait + 1,
      });
    }

    vacanciesInQueueRemained -= vacanciesAvailableToPublish;
    daysToWait++;
  }

  throw new PublishQueueError("publish queue is full");
};
