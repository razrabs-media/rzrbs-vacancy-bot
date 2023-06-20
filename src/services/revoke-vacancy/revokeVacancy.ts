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
      where: {
        tg_message_id: message_id,
        tg_chat_id: chat.id,
        author_username: chat.username,
      },
    });

    if (!vacancy) {
      throw Error(`vacancy not found`);
    }

    const vacancyInQueue = await PublishQueueItemModel.findOne({
      where: {
        vacancy_id: vacancy.id,
      },
    });

    if (!vacancyInQueue) {
      throw Error(`Failed: vacancy ${vacancy.id} is not in publish queue`);
    }

    vacancyInQueue.set({
      removed: true,
    });
    await vacancyInQueue.save();
    logger.info(`Revoke: vacancy ${vacancy.id} removed from publish queue`);

    vacancy.set({
      revoked: true,
      removed: true,
    });
    await vacancy.save();
    logger.info(`Revoke: vacancy ${vacancy.id} marked as revoked`);

    await ctx.editMessageCaption(`[ОТОЗВАНО]\n${caption}`, undefined);
  } catch (err) {
    logger.error(
      `Revoke: Failed to revoke vacancy ${chat?.username}::${
        chat?.id
      }::${message_id} - ${(err as Error)?.message || JSON.stringify(err)}`
    );
  }
};
