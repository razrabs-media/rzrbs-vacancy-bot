import { TimePeriod } from "../../constants/common";
import config from "../../utils/config";
import { getTimePeriodInMilliseconds } from "../../utils/getTimePeriodInMilliseconds";
import { PublishVacancyService, logger } from "../index";

export const subscribeToPublishQueueMonitoring = () => {
  if (!config.publishConfig.publishInterval) {
    throw Error(
      "ERROR: Publish queue won't work until PUBLISH_INTERVAL is set"
    );
  }

  logger.info(`Subscribed to check publish queue by timer`);

  // initial execution
  PublishVacancyService.monitorPublishQueueByTimer({ initialExecution: true });

  return setInterval(
    PublishVacancyService.monitorPublishQueueByTimer,
    getTimePeriodInMilliseconds(1, TimePeriod.Hours)
  );
};
