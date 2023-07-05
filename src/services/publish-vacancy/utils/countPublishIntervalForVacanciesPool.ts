import { WEEK, WeekDay } from "../../../constants/common";
import config from "../../../utils/config";
import { getTodayWeekDay } from "../../../utils/getTodayWeekDay";
import logger from "../../logger";
import { getPublishQueueLength } from "./getPublishQueueLength";

export const getTwoWeeksDaysArray = (): WeekDay[] => {
  const currentWeekDayIndex = WEEK.indexOf(getTodayWeekDay());
  return [
    ...WEEK.slice(currentWeekDayIndex),
    ...WEEK,
    ...WEEK.slice(0, currentWeekDayIndex),
  ];
};

export const countPublishIntervalForVacanciesPool =
  async (): Promise<number> => {
    const { publishInterval, minPublishInterval, schedule } =
      config.publishConfig;
    const publishQueueItemsLength = await getPublishQueueLength();

    if (!publishQueueItemsLength) {
      return publishInterval > minPublishInterval
        ? publishInterval
        : minPublishInterval;
    }

    const twoWeeksDays = getTwoWeeksDaysArray();
    for (
      let currentIntervalHours = publishInterval;
      currentIntervalHours > minPublishInterval;
      currentIntervalHours--
    ) {
      let availableVacanciesToPublish = 0;

      for (const weekDay of twoWeeksDays) {
        if (schedule[weekDay] === undefined) {
          continue;
        }

        if (availableVacanciesToPublish >= publishQueueItemsLength) {
          return currentIntervalHours;
        }

        const [from, to] = schedule[weekDay];
        let hourPointer = from;
        let dailyVacanciesAmount = 0;

        while (
          hourPointer <= to &&
          dailyVacanciesAmount <= config.publishConfig.dailyVacancyLimit
        ) {
          availableVacanciesToPublish++;
          dailyVacanciesAmount++;
          hourPointer += currentIntervalHours;
        }
      }

      if (availableVacanciesToPublish >= publishQueueItemsLength) {
        logger.info(
          `Publish Queue: vacancies will be published with ${currentIntervalHours}h interval`
        );
        return currentIntervalHours;
      }
    }
    logger.warn(
      `Publish Queue: vacancies can't be published in two weeks, interval is - ${minPublishInterval}h`
    );
    return minPublishInterval;
  };
