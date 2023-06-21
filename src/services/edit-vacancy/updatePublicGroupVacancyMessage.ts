import { IVacancyModel } from "../../types/vacancy";
import { buildMessageFromVacancy } from "../../utils/buildMessageFromVacancy";
import logger from "../logger";
import bot from "../../launchBot";

export const updatePublicGroupVacancyMessage = async ({
  vacancy,
}: {
  vacancy: IVacancyModel;
}) => {
  const {
    published_tg_chat_id: publishedChatIds,
    published_tg_message_id: publishedMessageIds,
  } = vacancy;

  if (!vacancy.published || vacancy.revoked || vacancy.removed) {
    logger.error(
      `Failed to update ${vacancy.id} vacancy in chats - vacancy not published, removed or revoked`
    );
    return;
  }

  if (!publishedChatIds?.length || !publishedMessageIds?.length) {
    logger.error(
      `Failed to update ${vacancy.id} vacancy in chats - incorrect info in published_tg_chat_id or published_tg_message_id fields`
    );
    return;
  }

  for (const chatIdIndex in publishedChatIds) {
    const publishedChatId = publishedChatIds[chatIdIndex];
    const publishedMessageId = publishedMessageIds[chatIdIndex];

    try {
      logger.info(
        `Updating ${vacancy.id} vacancy in ${publishedChatIds[chatIdIndex]} chat`
      );

      await bot.telegram?.editMessageText(
        publishedChatId,
        parseInt(publishedMessageId),
        undefined,
        buildMessageFromVacancy(vacancy)
      );
    } catch (err) {
      logger.error(
        `Failed to update ${vacancy.id} vacancy in ${publishedChatIds[chatIdIndex]} chat - ${err}`
      );
    }
  }
};
