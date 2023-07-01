import db from "../../connectToDatabase";
import { clearDailyPublishInterval } from "../../utils/dailyPublishInterval";
import logger from "../logger";

export const gracefulShutdown = ({
  publishQueueTimerId,
}: {
  publishQueueTimerId: NodeJS.Timer | number | undefined;
}) => {
  logger.info("Shutdown...");

  if (publishQueueTimerId) {
    clearInterval(publishQueueTimerId);
    logger.info("Publish queue monitoring finished");
  }

  clearDailyPublishInterval();
  logger.info("Publish queue daily publish timer cleared");

  db.close()
    .then(() => {
      logger.info("Database connection closed");
    })
    .catch(() => {
      logger.error("Failed DB connection closing, trying again");
      return db.close();
    })
    .finally(() => {
      logger.info("Done");
    });
};
