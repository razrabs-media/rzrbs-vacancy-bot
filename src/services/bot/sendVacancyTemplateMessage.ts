import { vacancyTemplateHTMLMessageText } from "../../constants/messages";
import { handleLogging } from "../logger";

export const sendVacancyTemplateMessage = async (ctx) => {
  const { chat, message_id } = ctx?.update?.message || {};
  const { username } = chat || {};
  const { logInfo, logError } = handleLogging(
    "sendVacancyTemplateMessage",
    { fromUsername: username, chatId: chat?.id, messageId: message_id },
    "Failed to send message with vacancy template"
  );

  try {
    logInfo(`User @${username} requests for template`);

    await ctx.reply(vacancyTemplateHTMLMessageText, { parse_mode: "HTML" });

    logInfo(`Vacancy template successfully sent to @${username}`);
  } catch (err) {
    logError(err);
  }
};
