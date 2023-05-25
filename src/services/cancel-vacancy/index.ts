import Vacancy from "../../schemas/vacancy";
import logger from "../logger";

export const onVacancyCancel = async (ctx) => {
  try {
    const { message_id, chat } = ctx.update.callback_query.message;
    const vacancy = await Vacancy.findOne({
      tg_message_id: message_id,
      tg_chat_id: chat.id,
    });

    if (!vacancy) {
      throw Error(`Vacancy from ${1}::${1} not found`);
    }

    vacancy.removed = true;
    await vacancy.save();
    logger.info(`Vacancy ${vacancy._id} marked as removed`);

    await ctx.editMessageReplyMarkup(undefined); // removes buttons
    await ctx.deleteMessage();
  } catch (err) {
    logger.error(`Failed to cancel vacancy - ${JSON.stringify(err)}`);
  }
};
