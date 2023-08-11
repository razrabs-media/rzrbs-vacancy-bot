import { handleLogging } from "../logger";
import { processEditingExistingVacancy } from "./processEditingExistingVacancy";
import { processNewVacancyMessage } from "./processNewVacancyMessage";

const isEditingExistingVacancy = (
  text: string,
  botUsername: string
): boolean => {
  const [techInfoLine] = text?.split("\n") || [];

  return techInfoLine?.startsWith(`@${botUsername}`);
};

/**
 * Processes Telegram "message" action.
 * - For message with completely new vacancy information - calls `processNewVacancyMessage`
 * - For message with system info to edit existing vacancy info - calls `processEditingExistingVacancy`
 *
 * @param ctx - Telegram "message" action ctx object
 */
export const processIncomingMessage = async (ctx) => {
  const { message_id, from, text, chat } = ctx?.update?.message || {};
  const { logError } = handleLogging(
    "processIncomingMessage",
    { fromUsername: from?.username, chatId: chat?.id, messageId: message_id },
    "Failed to process incoming message"
  );

  try {
    if (!message_id || !from?.username || !chat?.id) {
      throw Error("cannot retrieve required message info");
    }

    if (isEditingExistingVacancy(text, ctx?.botInfo?.username)) {
      await processEditingExistingVacancy(ctx);
    } else {
      await processNewVacancyMessage(ctx);
    }
  } catch (err) {
    logError(err);
  }
};
