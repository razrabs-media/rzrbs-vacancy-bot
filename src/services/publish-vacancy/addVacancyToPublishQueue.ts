import { SEPARATOR } from "../../constants/labels";
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
import { handleLogging } from "../logger";
import { PUBLISH_QUEUE_ERROR } from "../publish-queue/PublishQueueError";
import { countNextAvailableTimeslotToPublish } from "../publish-queue/countNextAvailableTimeslotToPublish";
import { updateButtonsUnderMessage } from "./utils/updateButtonsUnderMessage";

const removeFailedVacancyFromQueue = async (ctx) => {
  const { message_id, chat } = ctx?.update?.callback_query?.message || {};
  const { logInfo, logError } = handleLogging(
    "Publish Rollback::removeFailedVacancyFromQueue",
    { fromUsername: chat?.username, chatId: chat?.id, messageId: message_id },
    "Failed to remove vacancy"
  );

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

    logInfo(
      `Vacancy ${vacancy.id} removed from publish queue because of an error`
    );
  } catch (err) {
    logError(err);
  }
};

/**
 * Adds vacancy to publish queue.
 * Triggers on publish button click in private chat with Bot
 */
export const onPublishVacancy = async (ctx) => {
  const { message_id, chat, text, entities } =
    ctx?.update?.callback_query?.message || {};
  const { logInfo, logWarn, logError } = handleLogging(
    "onPublishVacancy",
    { fromUsername: chat?.username, chatId: chat?.id, messageId: message_id },
    "Failed to add vacancy"
  );

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

      logWarn(
        `User ${chat.username} tried to exceed user monthly limit ${config.publishConfig.userMonthVacancyLimit}`
      );
      logInfo(
        `vacancy ${vacancy.id} was not allowed for publishing by user limit`
      );
      return;
    }

    const newQueueItem = await PublishQueueItemModel.create({
      vacancy_id: vacancy.id,
    });

    if (!newQueueItem) {
      throw Error(`Failed to add vacancy ${vacancy.id} to publish queue`);
    }

    logInfo(`vacancy ${vacancy.id} successfully added to publish queue`);

    const nextTimeslotToPublish = await countNextAvailableTimeslotToPublish();
    const vacancyMessageText = buildMessageFromVacancy(
      vacancy,
      parseMessageEntities(text, entities)
    );

    await ctx.editMessageText(
      `${vacancyMessageText}\n` +
        `${SEPARATOR}\n` +
        `${getVacancyWillBePublishedText(nextTimeslotToPublish)}`,
      { parse_mode: "HTML" }
    );

    await updateButtonsUnderMessage(ctx);
  } catch (err) {
    if ((err as Error)?.name === PUBLISH_QUEUE_ERROR) {
      await ctx.sendMessage(publishQueueIsFullMessage);
    } else {
      await ctx.sendMessage(systemErrorMessage);
    }

    await removeFailedVacancyFromQueue(ctx);

    logError(err);
  }
};
