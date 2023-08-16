import winston, { format } from "winston";

import { Environment } from "../../types/common";
import config from "../../utils/config";

const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf(
      (info) =>
        `${info.timestamp} ${info.level}: ${info.message}` +
        (info.splat !== undefined ? `${info.splat}` : " ")
    )
  ),
  transports: [
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console(),
  ],
});

if (config.environment !== Environment.Prod) {
  logger.add(
    new winston.transports.File({ filename: "debug.log", level: "debug" })
  );
}

logger.info.bind(logger);

export default logger;
