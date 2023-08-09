import { TimePeriod } from "../../constants/common";
import config from "../../utils/config";
import { getTimePeriodInMilliseconds } from "../../utils/getTimePeriodInMilliseconds";
import { setPublishQueueMonitoringInterval } from "../../utils/publishInterval";
import { getCurrentMinutes } from "../../utils/time";
import { wait } from "../../utils/wait";
import { PublishQueueService, logger } from "../index";

export const subscribeToPublishQueueMonitoring = async () => {
  if (!config.publishConfig.publishInterval) {
    throw Error(
      "ERROR: Publish queue won't work until PUBLISH_INTERVAL is set"
    );
  }

  // corner case to wait for round hour to start publishing
  const currentMinutes = getCurrentMinutes();
  if (currentMinutes > 0) {
    logger.info(
      `Waiting ${
        60 - currentMinutes
      }mins before starting to monitor publish queue`
    );

    await wait(
      getTimePeriodInMilliseconds(60 - currentMinutes, TimePeriod.Minutes)
    );
  }

  logger.info(`Subscribed to check publish queue by timer`);

  // initial execution
  PublishQueueService.monitorPublishQueueByTimer({ initialExecution: true });

  setPublishQueueMonitoringInterval(
    setInterval(
      PublishQueueService.monitorPublishQueueByTimer,
      getTimePeriodInMilliseconds(1, TimePeriod.Hours)
    )
  );
};
