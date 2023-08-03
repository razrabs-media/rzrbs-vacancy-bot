import {
  companyLimitExceededMessage,
  getMissingRequiredFieldsMessage,
  parsedVacancyToReviewMessage,
  textProcessingMessage,
  userLimitExceededMessage,
} from "../../constants/messages";
import { isPublishingAllowedForCompany } from "../../utils/isPublishingAllowedForCompany";
import { isPublishingAllowedForUser } from "../../utils/isPublishingAllowedForUser";
import { isRequiredVacancyFieldsFilled } from "../../utils/isRequiredVacancyFieldsFilled";
import { parseMessageEntities } from "../../utils/parseMessageEntities";
import logger from "../logger";
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

  await ctx.sendMessage(textProcessingMessage);

  const parsedMessage = await parseMessageToVacancy(text, ctx);

  const { isRequiredFieldsFilled, missingFields } =
    isRequiredVacancyFieldsFilled(parsedMessage);

  if (!isRequiredFieldsFilled) {
    await ctx.sendMessage(getMissingRequiredFieldsMessage(missingFields));
    throw Error(`missing fields - ${missingFields.join(", ")}`);
  }

  // check user's limits
  const isPublishingAllowedForCurrentUser = isPublishingAllowedForUser(
    from.username
  );
  if (!isPublishingAllowedForCurrentUser) {
    await ctx.sendMessage(userLimitExceededMessage);
    throw Error(`@${from.username} user's publishing limit exceeded`);
  }

  // check company's limits
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

  // check the queue??

  const { previewMessageText, messageOptions } =
    constructPreviewMessage(
      ctx,
      parsedMessage,
      parseMessageEntities(text, entities)
    ) || {};

  await ctx.sendMessage(parsedVacancyToReviewMessage);

  const response = await ctx.sendMessage(previewMessageText, {
    ...messageOptions,
    reply_to_message_id: message_id,
  });

  logger.info(
    `Successfully sent vacancy preview message for - ${from.username}::${chat?.id}::${message_id}`
  );

  if (!response.message_id) {
    throw Error("preview message sending was failed");
  }

  await createNewVacancy({
    vacancy: {
      ...parsedMessage,
      author_username: from.username,
      tg_message_id: response.message_id,
      tg_chat_id: response.chat.id,
    },
    messageId: response.message_id,
    chatId: response.chat.id,
  });
};
