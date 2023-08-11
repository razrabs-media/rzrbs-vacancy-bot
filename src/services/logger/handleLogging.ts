import { TelegramMessageParams } from "../../types/telegram";
import logger from "./logger";

export const handleLogging = (
  logName: string,
  telegramMessage?: TelegramMessageParams,
  errorInfo?: string
) => {
  const { fromUsername, chatId, messageId } = telegramMessage || {};
  const prefix = telegramMessage
    ? `[${logName} > ${fromUsername}::${chatId}::${messageId}]`
    : `[${logName}]`;
  return {
    logInfo: (info: string) => logger.info(`${prefix}: ${info}`),
    logWarn: (warn: string) => logger.warn(`${prefix}: ${warn}`),
    logError: (error: unknown) =>
      logger.error(
        `${prefix}: ${errorInfo || "Something went wrong"} - ${
          (error as Error)?.message || JSON.stringify(error)
        }`
      ),
  };
};
