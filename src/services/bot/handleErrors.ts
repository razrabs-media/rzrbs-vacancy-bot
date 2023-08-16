import { systemErrorMessage } from "../../constants/messages";
import { handleLogging } from "../logger";

export const handleErrors = (err, ctx) => {
  const { message_id, from, chat } = ctx?.update?.message || {};
  const { logError } = handleLogging("Global Bot Error", {
    fromUsername: from?.username,
    chatId: chat?.id,
    messageId: message_id,
  });

  ctx.sendMessage(systemErrorMessage);
  logError(err);
};
