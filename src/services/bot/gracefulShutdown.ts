import db from "../../connectToDatabase";
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
