import PublishQueueItemModel from "../../schemas/publish_queue";
import VacancyModel from "../../schemas/vacancy";
import { handleLogging } from "../logger";

export const onVacancyRevoke = async (ctx) => {
  const { message_id, text, chat } = ctx?.update?.callback_query?.message || {};
  const { logInfo, logError } = handleLogging(
    "onVacancyRevoke",
    { fromUsername: chat?.username, chatId: chat?.id, messageId: message_id },
    "Failed to revoke vacancy"
  );

  try {
    if (!message_id || !text || !chat?.id || !chat?.username) {
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
    logInfo(`vacancy ${vacancy.id} removed from publish queue`);

    vacancy.set({
      revoked: true,
      removed: true,
    });
    await vacancy.save();
    logInfo(`vacancy ${vacancy.id} marked as revoked`);

    await ctx.editMessageText(`[ОТОЗВАНО]\n${text}`, undefined);
  } catch (err) {
    logError(err);
  }
};
