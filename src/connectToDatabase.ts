import { Sequelize } from "sequelize";
import logger from "./services/logger";
import config from "./utils/config";

if (!config.dbUrl) {
  throw Error("Failed to start, DB_URL is missing");
}

const sequelize = new Sequelize(config.dbUrl, {
  logging: (str) => logger.debug(`DB >>> ${str}`),
});

sequelize
  .authenticate()
  .then(() => {
    logger.info("Connected to DB");
  })
  .catch((err) => {
    logger.error("Failed to connect to DB", err);
    throw Error(`Failed to connect to DB - ${err}`);
  });

export default sequelize;
