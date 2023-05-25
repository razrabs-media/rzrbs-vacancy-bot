import PublishQueueItemModel from "../../schemas/publish_queue";
import VacancyModel from "../../schemas/vacancy";
import logger from "../logger";

export const onVacancyRevoke = async (ctx) => {
  try {
    if (!ctx.update.callback_query.message) {
      return;
    }
    const { message_id, caption, chat } = ctx.update.callback_query.message;

    const vacancy = await VacancyModel.findOne({
      tg_message_id: message_id,
      tg_chat_id: chat.id,
    });

    if (!vacancy) {
      logger.error(`Failed: vacancy from message ${message_id} is not found`);
      return;
    }

    const vacancyInQueue = await PublishQueueItemModel.findOne({
      "vacancy._id": vacancy._id,
    });

    if (!vacancyInQueue) {
      logger.error(`Failed: vacancy ${vacancy._id} is not in publish queue`);
      return;
    }

    vacancyInQueue.removed = true;
    await vacancyInQueue.save();
    logger.info(
      `Revoke: vacancy ${vacancyInQueue._id} removed from publish queue`
    );

    vacancy.revoked = true;
    await vacancy.save();
    logger.info(`Revoke: vacancy ${vacancyInQueue._id} marked as revoked`);

    await ctx.editMessageCaption(`[ОТОЗВАНО]\n${caption}`, undefined);
  } catch (err) {
    logger.error(`Revoke: Failed to revoke vacancy - ${JSON.stringify(err)}`);
  }
};
