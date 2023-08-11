import { helpMessageText } from "../../constants/messages";
import { handleLogging } from "../logger";

export const sendHelpMessage = async (ctx) => {
  const { chat, message_id } = ctx?.update?.message || {};
  const { username } = chat || {};
  const { logInfo, logError } = handleLogging(
    "sendHelpMessage",
    { fromUsername: username, chatId: chat?.id, messageId: message_id },
    "Failed to send message with help info"
  );

  try {
    logInfo(`User @${username} requests for help`);

    await ctx.reply(helpMessageText, { parse_mode: "HTML" });

    logInfo(`Help message successfully sent to @${username}`);
  } catch (err) {
    logError(err);
  }
};
