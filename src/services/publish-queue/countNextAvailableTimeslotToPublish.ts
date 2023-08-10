import config from "../../utils/config";
import { getRoundDate } from "../../utils/getRoundDate";
import { getTodayWeekDay } from "../../utils/getTodayWeekDay";
import { getTwoWeeksDaysArray } from "../../utils/getTwoWeeksDaysArray";
import { getCurrentHours } from "../../utils/time";
import PublishQueueError from "./PublishQueueError";
import { countPublishIntervalForVacanciesPool } from "./countPublishIntervalForVacanciesPool";
import { getPublishQueueLength } from "./getPublishQueueLength";

const getNearestAvailableHour = (
  currentHour: number,
  currentDay: [number, number],
  publishInterval: number
): number => {
  const [from, to] = currentDay;
  let nearestAvailableHour = from;

  while (nearestAvailableHour < currentHour && nearestAvailableHour < to) {
    nearestAvailableHour += publishInterval;
  }
  return nearestAvailableHour;
};

export const countNextAvailableTimeslotToPublish = async (): Promise<Date> => {
  const publishInterval = await countPublishIntervalForVacanciesPool();
  const publishQueueLength = await getPublishQueueLength();
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

  // if today is day off or work day is over
  if (
    !publishSchedule[todayWeekDay] ||
    currentHour > publishSchedule[todayWeekDay][1]
  ) {
    twoWeeksDays.shift();
  }

  let vacanciesInQueueRemained = publishQueueLength;

  // if working day is in progress
  if (
    currentHour >= publishSchedule[todayWeekDay][0] &&
    currentHour <= publishSchedule[todayWeekDay][1]
  ) {
    const nearestAvailableHour = getNearestAvailableHour(
      currentHour,
      publishSchedule[todayWeekDay],
      publishInterval
    );
    const hoursRemained =
      publishSchedule[todayWeekDay][1] - nearestAvailableHour;
    const vacanciesAvailableToPublish = Math.ceil(
      hoursRemained / publishInterval
    );

    if (vacanciesAvailableToPublish < publishQueueLength) {
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

    if (vacanciesInQueueRemained - vacanciesAvailableToPublish <= 0) {
      const nearestAvailableHour = getNearestAvailableHour(
        from,
        publishSchedule[weekDay],
        publishInterval
      );
      return getRoundDate({
        hour: nearestAvailableHour,
        daysToAdd: daysToWait + 1,
      });
    }

    daysToWait++;
  }

  throw new PublishQueueError("publish queue is full");
};
