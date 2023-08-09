import bot from "../../launchBot";
import VacancyModel from "../../schemas/vacancy";
import { IVacancy } from "../../types/vacancy";
import { buildMessageFromVacancy } from "../../utils/buildMessageFromVacancy";
import logger from "../logger";

export const sendVacancyToContact = async (
  vacancy: IVacancy,
  chatId: string
) => {
  try {
    logger.info(`Sending ${vacancy.id} vacancy to ${chatId}...`);

    // FIXME: add parsed entitles, store them in DB?
    const message = await bot.telegram?.sendMessage(
      chatId,
      buildMessageFromVacancy(vacancy),
      {
        parse_mode: "HTML",
      }
    );

    if (!message) {
      throw Error(`failed to send message`);
    }

    const vacancyInstance = await VacancyModel.findOne({
      where: {
        id: vacancy.id,
      },
    });

    if (!vacancyInstance) {
      throw Error("failed to mark vacancy as published in DB");
    }

    await vacancyInstance.set({
      published: true,
      publishedAt: new Date(message.date * 1000),
      published_tg_chat_id: [
        ...(vacancyInstance.published_tg_chat_id || []),
        String(message.chat.id),
      ],
      published_tg_message_id: [
        ...(vacancyInstance.published_tg_message_id || []),
        String(message.message_id),
      ],
    });

    await vacancyInstance.save();
    logger.info(`Success: ${vacancy.id} vacancy sent to ${chatId}`);
  } catch (err) {
    logger.error(
      `Failed to publish ${vacancy.id} vacancy to ${chatId} - ${err}`
    );
  }
};
