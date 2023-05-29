import PublishQueueItemModel from "../../schemas/publish_queue";
import VacancyModel from "../../schemas/vacancy";
import logger from "../logger";

export const onVacancyRevoke = async (ctx) => {
  const { message_id, caption, chat } =
    ctx?.update?.callback_query?.message || {};

  try {
    if (!message_id || !caption || !chat?.id || !chat?.username) {
      throw Error("cannot retrieve info about message");
    }

    const vacancy = await VacancyModel.findOne({
      tg_message_id: message_id,
      tg_chat_id: chat.id,
      "author.username": chat.username,
    });

    if (!vacancy) {
      throw Error(`vacancy not found`);
    }

    const vacancyInQueue = await PublishQueueItemModel.findOne({
      "vacancy._id": vacancy._id,
    });

    if (!vacancyInQueue) {
      throw Error(`Failed: vacancy ${vacancy._id} is not in publish queue`);
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
    logger.error(
      `Revoke: Failed to revoke vacancy ${chat?.username}::${
        chat?.id
      }::${message_id} - ${(err as Error)?.message || JSON.stringify(err)}`
    );
  }
};
