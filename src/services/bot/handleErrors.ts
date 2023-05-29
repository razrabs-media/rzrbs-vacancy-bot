import logger from "../logger";

export const handleErrors = (err) => {
  logger.error(
    `Something went wrong: ${(err as Error).message || JSON.stringify(err)}`
  );
};
