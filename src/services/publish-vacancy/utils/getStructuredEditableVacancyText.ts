import { EDIT_MESSAGE_DISCLAIMER_TEXT } from "../../../constants/labels";
import VacancyModel from "../../../schemas/vacancy";
import { TelegramMessageParams } from "../../../types/telegram";
import { buildMessageFromVacancy } from "../../../utils/buildMessageFromVacancy";
import { handleLogging } from "../../logger";

export const getStructuredEditableVacancyText = async ({
  messageId,
  chatId,
  fromUsername,
  text,
}: TelegramMessageParams): Promise<string> => {
  const { logError } = handleLogging(
    "getStructuredEditableVacancyText",
    { fromUsername, chatId, messageId },
    "failed to build editable vacancy text"
  );

  try {
    if (!chatId || !messageId || !fromUsername || !text) {
      throw Error(`cannot retrieve required info`);
    }

    const vacancy = await VacancyModel.findOne({
      where: {
        tg_chat_id: chatId,
        tg_message_id: messageId,
        author_username: fromUsername,
      },
    });

    if (!vacancy) {
      throw Error("vacancy not found");
    }

    return (
      `> ${messageId}\n` +
      `${EDIT_MESSAGE_DISCLAIMER_TEXT}\n` +
      `\n` +
      `${buildMessageFromVacancy(vacancy)}`
    );
  } catch (err) {
    logError(err);
    return "";
  }
};
