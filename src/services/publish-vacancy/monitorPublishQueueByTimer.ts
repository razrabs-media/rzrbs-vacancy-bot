import { TimePeriod } from "../../constants/common";
import config from "../../utils/config";
import { getTimePeriodInMilliseconds } from "../../utils/getTimePeriodInMilliseconds";
import { getTodayWeekDay } from "../../utils/getTodayWeekDay";
import { setDailyPublishInterval } from "../../utils/publishInterval";
import { getCurrentHours } from "../../utils/time";
import logger from "../logger";
import { publishNextVacancyFromQueue } from "./publishNextVacancyFromQueue";
import { countPublishIntervalForVacanciesPool } from "./utils/countPublishIntervalForVacanciesPool";

export const monitorPublishQueueByTimer = async (params?: {
  initialExecution?: boolean;
}) => {
  const currentHour = getCurrentHours();
  const currentWeekDay = getTodayWeekDay();
  const [from, to] = config.publishConfig.schedule[currentWeekDay] || [];

  if (currentHour === 0) {
    logger.info(`Publish Queue: new day started`);

    if (!from && !to) {
      logger.info(
        "Publish Queue: Today is a day off, analyzis finished for today"
      );
      return;
    }
  }

  const shouldStartAnalysisWithInitialExec =
    params?.initialExecution && currentHour >= from && currentHour < to;

  if (shouldStartAnalysisWithInitialExec || currentHour === from) {
    logger.info(`Publish Queue: analysis by timer...`);
    const publishInterval = await countPublishIntervalForVacanciesPool();

    logger.info(
      `Vacancies will be published with ${publishInterval} hours interval`
    );

    // initial execution
    publishNextVacancyFromQueue();

    setDailyPublishInterval(
      setInterval(
        publishNextVacancyFromQueue,
        getTimePeriodInMilliseconds(publishInterval, TimePeriod.Hours)
      )
    );
  } else if (params?.initialExecution && !shouldStartAnalysisWithInitialExec) {
    logger.info(
      `Publish Queue: analysis wasnt't started with initial execution of monitoring, ` +
        `because now is outside of working hours`
    );
  }
};
