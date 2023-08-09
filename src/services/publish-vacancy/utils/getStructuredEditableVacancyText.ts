import { EDIT_MESSAGE_DISCLAIMER_TEXT } from "../../../constants/labels";
import VacancyModel from "../../../schemas/vacancy";
import { buildMessageFromVacancy } from "../../../utils/buildMessageFromVacancy";
import logger from "../../logger";

export const getStructuredEditableVacancyText = async ({
  messageId,
  chatId,
  fromUsername,
  text,
}: {
  messageId: number;
  chatId: number;
  fromUsername: string;
  text?: string;
}): Promise<string> => {
  try {
    if (!chatId || !messageId || !fromUsername || !text) {
      throw Error(
        `cannot retrieve required info - ${{
          chatId,
          messageId,
          fromUsername,
          text,
        }}`
      );
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

    // FIXME: add entitles, store them in DB?
    return (
      `> ${messageId}\n` +
      `${EDIT_MESSAGE_DISCLAIMER_TEXT}\n` +
      `\n` +
      `${buildMessageFromVacancy(vacancy)}`
    );
  } catch (err) {
    logger.error(
      `Editable vacancy: failed to build editable ${fromUsername}::${chatId}::${messageId} vacancy text - ${
        (err as Error)?.message || JSON.stringify(err)
      }`
    );
    return "";
  }
};
