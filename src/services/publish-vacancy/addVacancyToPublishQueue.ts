import {
  publishQueueIsFullMessage,
  systemErrorMessage,
  vacancyLimitExceededMessageText,
} from "../../constants/messages";
import PublishQueueItemModel from "../../schemas/publish_queue";
import VacancyModel from "../../schemas/vacancy";
import { buildMessageFromVacancy } from "../../utils/buildMessageFromVacancy";
import config from "../../utils/config";
import { getVacancyWillBePublishedText } from "../../utils/getVacancyWillBePublishedText";
import { isPublishingAllowedForUser } from "../../utils/isPublishingAllowedForUser";
import { parseMessageEntities } from "../../utils/parseMessageEntities";
import logger from "../logger";
import { PUBLISH_QUEUE_ERROR } from "../publish-queue/PublishQueueError";
import { countNextAvailableTimeslotToPublish } from "../publish-queue/countNextAvailableTimeslotToPublish";
import { updateButtonsUnderMessage } from "./utils/updateButtonsUnderMessage";

const removeFailedVacancyFromQueue = async (ctx) => {
  const { message_id, chat } = ctx?.update?.callback_query?.message || {};

  try {
    if (!message_id || !chat?.id || !chat?.username) {
      return;
    }

    const vacancy = await VacancyModel.findOne({
      where: {
        tg_message_id: message_id,
        tg_chat_id: chat.id,
        author_username: chat.username,
      },
    });

    if (!vacancy) {
      return;
    }

    const queueItem = await PublishQueueItemModel.findOne({
      where: {
        vacancy_id: vacancy.id,
        removed: false,
        published: false,
      },
    });

    if (!queueItem) {
      return;
    }

    await queueItem.destroy();

    logger.info(
      `Vacancy ${vacancy.id} removed from publish queue because of an error`
    );
  } catch (err) {
    logger.error(
      `Publish Rollback: Failed to remove vacancy ${chat?.username}::${
        chat?.id
      }::${message_id} from publish queue - ${
        (err as Error)?.message || JSON.stringify(err)
      }`
    );
  }
};

/**
 * Adds vacancy to publish queue.
 * Triggers on publish button click in private chat with Bot
 */
export const onPublishVacancy = async (ctx) => {
  const { message_id, chat, text, entities } =
    ctx?.update?.callback_query?.message || {};

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

    const nextTimeslotToPublish = await countNextAvailableTimeslotToPublish();
    const vacancyMessageText = buildMessageFromVacancy(
      vacancy,
      parseMessageEntities(text, entities)
    );

    await ctx.editMessageText(
      `${vacancyMessageText}\n` +
        `___________________\n` +
        `${getVacancyWillBePublishedText(nextTimeslotToPublish)}`,
      { parse_mode: "HTML" }
    );

    await updateButtonsUnderMessage(ctx);
  } catch (err) {
    const { name, message } = (err as Error) || {};

    if (name === PUBLISH_QUEUE_ERROR) {
      await ctx.sendMessage(publishQueueIsFullMessage);
    }

    await removeFailedVacancyFromQueue(ctx);
    await ctx.sendMessage(systemErrorMessage);

    logger.error(
      `Publish: Failed to add vacancy ${chat?.username}::${
        chat?.id
      }::${message_id} to publish queue - ${message || JSON.stringify(err)}`
    );
  }
};
