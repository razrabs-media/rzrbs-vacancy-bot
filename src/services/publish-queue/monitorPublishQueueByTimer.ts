import { TimePeriod } from "../../constants/common";
import config from "../../utils/config";
import { getTimePeriodInMilliseconds } from "../../utils/getTimePeriodInMilliseconds";
import { getTodayWeekDay } from "../../utils/getTodayWeekDay";
import { setDailyPublishInterval } from "../../utils/publishInterval";
import { getCurrentHours } from "../../utils/time";
import { handleLogging } from "../logger";
import { countPublishIntervalForVacanciesPool } from "./countPublishIntervalForVacanciesPool";
import { publishNextVacancyFromQueue } from "./publishNextVacancyFromQueue";

export const monitorPublishQueueByTimer = async (params?: {
  initialExecution?: boolean;
}) => {
  const currentHour = getCurrentHours();
  const currentWeekDay = getTodayWeekDay();
  const [from, to] = config.publishConfig.schedule[currentWeekDay] || [];
  const { logInfo } = handleLogging("Publish Queue");

  if (currentHour === 0) {
    logInfo(`new day started`);

    if (!from && !to) {
      logInfo("Today is a day off, analyzis finished for today");
      return;
    }
  }

  const shouldStartAnalysisWithInitialExec =
    params?.initialExecution && currentHour >= from && currentHour < to;

  if (shouldStartAnalysisWithInitialExec || currentHour === from) {
    logInfo(`analysis by timer...`);
    const publishInterval = await countPublishIntervalForVacanciesPool();

    logInfo(
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
    logInfo(
      `analysis wasnt't started with initial execution of monitoring, ` +
        `because now is outside of working hours`
    );
  }
};
