import { vacancyLimitExceededMessageText } from "../../constants/messages";
import PublishQueueItemModel from "../../schemas/publish_queue";
import VacancyModel from "../../schemas/vacancy";
import config from "../../utils/config";
import { isPublishingAllowedForUser } from "../../utils/isPublishingAllowedForUser";
import logger from "../logger";
import { updateButtonsUnderMessage } from "./utils/updateButtonsUnderMessage";

/**
 * Adds vacancy to publish queue.
 * Triggers on publish button click in private chat with Bot
 */
export const onPublishVacancy = async (ctx) => {
  const { message_id, chat } = ctx?.update?.callback_query?.message || {};

  try {
    if (!message_id || !chat?.id || !chat?.username) {
      throw Error("Failed to get vacancy info from message");
    }

    const vacancy = await VacancyModel.findOne({
      where: {
        tg_message_id: message_id,
        tg_chat_id: chat.id,
        author_username: chat.username,
      },
    });

    if (!vacancy) {
      throw Error("vacancy not found");
    }

    const isPublishingAllowed = await isPublishingAllowedForUser(chat.username);
    if (!isPublishingAllowed) {
      await ctx.sendMessage(vacancyLimitExceededMessageText);

      logger.warn(
        `User ${chat.username} tried to exceed user monthly limit ${config.publishConfig.userMonthVacancyLimit}`
      );
      logger.info(
        `Publish: vacancy ${vacancy.id} was not allowed for publishing by user limit`
      );
      return;
    }

    const newQueueItem = await PublishQueueItemModel.create({
      vacancy_id: vacancy.id,
    });

    if (!newQueueItem) {
      throw Error(`Failed to add vacancy ${vacancy.id} to publish queue`);
    }

    logger.info(
      `Publish: vacancy ${vacancy.id} successfully added to publish queue`
    );

    await updateButtonsUnderMessage(ctx);
  } catch (err) {
    logger.error(
      `Publish: Failed to add vacancy ${chat?.username}::${
        chat?.id
      }::${message_id} to publish queue - ${
        (err as Error).message || JSON.stringify(err)
      }`
    );
  }
};
