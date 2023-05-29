import Vacancy from "../../schemas/vacancy";
import logger from "../logger";

export const onVacancyCancel = async (ctx) => {
  try {
    const { message_id, chat } = ctx?.update?.callback_query?.message || {};

    if (!message_id || !chat?.id || !chat?.username) {
      throw Error("cannot retrieve message_id, chat.id or chat.username");
    }

    const vacancy = await Vacancy.findOne({
      tg_message_id: message_id,
      tg_chat_id: chat.id,
      "author.username": chat.username,
    });

    if (!vacancy) {
      throw Error(
        `Vacancy from ${chat.username}::${chat.id}::${message_id} not found`
      );
    }

    vacancy.removed = true;
    await vacancy.save();
    logger.info(`Vacancy ${vacancy._id} marked as removed`);

    // removes buttons
    await ctx.editMessageReplyMarkup(undefined);
    await ctx.deleteMessage();
  } catch (err) {
    logger.error(
      `Failed to cancel vacancy - ${
        (err as Error).message || JSON.stringify(err)
      }`
    );
  }
};
