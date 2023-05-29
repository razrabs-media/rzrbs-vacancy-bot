import mongoose from "mongoose";
import logger from "../logger";

export const gracefulShutdown = ({
  publishQueueTimerId,
}: {
  publishQueueTimerId: NodeJS.Timer | undefined;
}) => {
  logger.info("Shutdown...");

  if (publishQueueTimerId) {
    clearInterval(publishQueueTimerId);
    logger.info("Publish queue monitoring finished");
  }

  mongoose.connection
    .close()
    .then(() => {
      logger.info("Database connection closed");
    })
    .catch(() => {
      logger.error("Failed DB connection closing, trying again");
      return mongoose.connection.close();
    })
    .finally(() => {
      logger.info("Done");
    });
};
