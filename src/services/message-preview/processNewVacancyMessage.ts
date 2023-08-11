import {
  companyLimitExceededMessage,
  getMissingRequiredFieldsMessage,
  parsedVacancyToReviewMessage,
  publishQueueIsFullMessage,
  systemErrorMessage,
  textProcessingMessage,
  userLimitExceededMessage,
} from "../../constants/messages";
import { filterSupportedTelegramEntities } from "../../utils/filterSupportedTelegramEntities";
import { isPublishingAllowedDuringTwoWeeks } from "../../utils/isPublishingAllowedDuringTwoWeeks";
import { isPublishingAllowedForCompany } from "../../utils/isPublishingAllowedForCompany";
import { isPublishingAllowedForUser } from "../../utils/isPublishingAllowedForUser";
import { isRequiredVacancyFieldsFilled } from "../../utils/isRequiredVacancyFieldsFilled";
import { parseMessageEntities } from "../../utils/parseMessageEntities";
import { handleLogging } from "../logger";
import PublishQueueError from "../publish-queue/PublishQueueError";
import { constructPreviewMessage } from "./constructPreviewMessage";
import { createNewVacancy } from "./createNewVacancy";
import { parseMessageToVacancy } from "./parseMessageToVacancy";

/**
 * Runs through following steps with brand new vacancy message:
 * 1. sends message that process started
 * 2. checks that text is vacancy by AI
 * 3. checks that text contains all required fields
 * 4. checks user's limit to publish next vacancy
 * 5. checks company's limit to publish next vacancy
 * 6. checks free slots in publish queue
 * 7. sends vacancy preview with buttons - publish, cancel, retry parsing
 *
 * @param ctx - Telegraf "message" action ctx object
 *
 * @throws Error, if one of checks didn't pass, should be wrapped by try-catch
 */
export const processNewVacancyMessage = async (ctx) => {
  const { message_id, from, text, chat, entities } = ctx?.update?.message || {};
  const { logInfo } = handleLogging("processNewVacancyMessage", {
    fromUsername: from?.username,
    chatId: chat?.id,
    messageId: message_id,
  });

  logInfo(`Started processing incoming message`);

  await ctx.sendMessage(textProcessingMessage);

  const parsedMessage = await parseMessageToVacancy(text, ctx);

  const { isRequiredFieldsFilled, missingFields } =
    isRequiredVacancyFieldsFilled(parsedMessage);

  if (!isRequiredFieldsFilled) {
    await ctx.sendMessage(getMissingRequiredFieldsMessage(missingFields));
    throw Error(`missing fields - ${missingFields.join(", ")}`);
  }

  // checks user's limits
  const isPublishingAllowedForCurrentUser = isPublishingAllowedForUser(
    from.username
  );
  if (!isPublishingAllowedForCurrentUser) {
    await ctx.sendMessage(userLimitExceededMessage);
    throw Error(`@${from.username} user's publishing limit exceeded`);
  }

  // checks company's limits
  const isPublishingAllowedForCurrentCompany = isPublishingAllowedForCompany(
    from.username,
    parsedMessage.company_name
  );
  if (!isPublishingAllowedForCurrentCompany) {
    await ctx.sendMessage(companyLimitExceededMessage);
    throw Error(
      `${from.username}::${parsedMessage.company_name} company's publishing limit exceeded`
    );
  }

  // checks if vacancy can be published in two weeks period
  const isPublishingAllowedInTwoWeeksPeriod =
    await isPublishingAllowedDuringTwoWeeks();
  if (!isPublishingAllowedInTwoWeeksPeriod) {
    await ctx.sendMessage(publishQueueIsFullMessage);
    throw new PublishQueueError("publish queue is full");
  }

  try {
    const { previewMessageText, messageOptions } =
      constructPreviewMessage(
        { messageId: message_id, chatId: chat.id, fromUsername: from.username },
        parsedMessage,
        parseMessageEntities(text, entities)
      ) || {};

    await ctx.sendMessage(parsedVacancyToReviewMessage);

    const response = await ctx.sendMessage(previewMessageText, {
      ...messageOptions,
      reply_to_message_id: message_id,
    });

    logInfo(`Successfully sent vacancy preview message`);

    if (!response.message_id) {
      throw Error("preview message sending was failed");
    }

    await createNewVacancy({
      vacancy: {
        ...parsedMessage,
        author_username: from.username,
        tg_message_id: response.message_id,
        tg_chat_id: response.chat.id,
        tg_parsed_entities: JSON.stringify(
          parseMessageEntities(text, filterSupportedTelegramEntities(entities))
        ),
      },
      messageId: response.message_id,
      chatId: response.chat.id,
    });
  } catch (err) {
    await ctx.sendMessage(systemErrorMessage);
    throw err;
  }
};
