import { Sequelize } from "sequelize";
import logger from "./services/logger";

if (!process.env.DB_URL) {
  throw Error("Failed to start, DB_URL is missing");
}

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: (str) => logger.debug(`DB >>> ${str}`),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
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
