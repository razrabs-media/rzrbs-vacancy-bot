import bot from "../../launchBot";
import { IVacancyModel } from "../../types/vacancy";
import { buildMessageFromVacancy } from "../../utils/buildMessageFromVacancy";
import { handleLogging } from "../logger";

export const updatePublicGroupVacancyMessage = async ({
  vacancy,
}: {
  vacancy: IVacancyModel;
}) => {
  const {
    published_tg_chat_id: publishedChatIds,
    published_tg_message_id: publishedMessageIds,
    author_username,
    tg_chat_id,
    tg_message_id,
  } = vacancy;
  const { logInfo, logError } = handleLogging(
    "updatePublicGroupVacancyMessage",
    {
      fromUsername: author_username,
      chatId: tg_chat_id,
      messageId: tg_message_id,
    },
    `Failed to update ${vacancy.id} vacancy in chats`
  );

  if (!vacancy.published || vacancy.revoked || vacancy.removed) {
    logError("vacancy not published, removed or revoked");
    return;
  }

  if (!publishedChatIds?.length || !publishedMessageIds?.length) {
    logError(
      "incorrect info in published_tg_chat_id or published_tg_message_id fields"
    );
    return;
  }

  for (const chatIdIndex in publishedChatIds) {
    const publishedChatId = publishedChatIds[chatIdIndex];
    const publishedMessageId = publishedMessageIds[chatIdIndex];

    try {
      logInfo(
        `Updating ${vacancy.id} vacancy in ${publishedChatIds[chatIdIndex]} chat`
      );

      await bot.telegram?.editMessageText(
        publishedChatId,
        parseInt(publishedMessageId),
        undefined,
        buildMessageFromVacancy(vacancy)
      );
    } catch (err) {
      logError(err);
    }
  }
};
