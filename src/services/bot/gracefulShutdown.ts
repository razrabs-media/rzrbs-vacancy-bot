import db from "../../connectToDatabase";
import {
  clearDailyPublishInterval,
  clearPublishQueueMonitoringInterval,
} from "../../utils/publishInterval";
import logger from "../logger";

export const gracefulShutdown = () => {
  logger.info("Shutdown...");

  clearPublishQueueMonitoringInterval();
  logger.info("Publish queue monitoring finished");

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
