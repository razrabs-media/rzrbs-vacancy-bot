import {
  getMissingRequiredFieldsMessage,
  parsedVacancyToReviewMessage,
  systemErrorMessage,
  textProcessingMessage,
} from "../../constants/messages";
import { filterSupportedTelegramEntities } from "../../utils/filterSupportedTelegramEntities";
import { isRequiredVacancyFieldsFilled } from "../../utils/isRequiredVacancyFieldsFilled";
import { isTextTheSameError } from "../../utils/isTextTheSameError";
import { parseMessageEntities } from "../../utils/parseMessageEntities";
import { handleLogging } from "../logger";
import { constructPreviewMessage } from "./constructPreviewMessage";
import { editNewVacancy } from "./editNewVacancy";
import { parseMessageToVacancy } from "./parseMessageToVacancy";

export const onRetryParsing = async (ctx) => {
  const [, messageIdToParse] = ctx?.match || [];
  const { message_id, chat, reply_to_message } =
    ctx?.update?.callback_query?.message || {};
  const { logInfo, logError } = handleLogging(
    "onRetryParsing",
    { fromUsername: chat?.username, chatId: chat?.id, messageId: message_id },
    "Failed to re-parse vacancy"
  );
  const {
    message_id: sourceMessageId,
    text: sourceText,
    entities: sourceEntities,
  } = reply_to_message || {};

  try {
    logInfo(`re-parsing of vacancy was triggered`);
    await ctx.sendMessage(textProcessingMessage);

    if (!reply_to_message || !sourceText) {
      throw Error(
        `cannot retrieve required info - reply_to_message, sourceText`
      );
    }

    if (!messageIdToParse) {
      await ctx.sendMessage(systemErrorMessage);
      throw Error(
        `messageIdToParse is missing, check button regexp. messageIdToParse=${messageIdToParse}`
      );
    }

    if (Number(messageIdToParse) !== sourceMessageId) {
      await ctx.sendMessage(systemErrorMessage);
      throw Error(
        `messageIdToParse is wrong, check reply regexp. messageIdToParse=${messageIdToParse}`
      );
    }

    const parsedVacancy = await parseMessageToVacancy(sourceText, ctx);

    const { isRequiredFieldsFilled, missingFields } =
      isRequiredVacancyFieldsFilled(parsedVacancy);

    if (!isRequiredFieldsFilled) {
      await ctx.sendMessage(getMissingRequiredFieldsMessage(missingFields));
      logError(`missing fields - ${missingFields.join(", ")}`);
      return;
    }

    const parsedEntities = parseMessageEntities(
      sourceText,
      filterSupportedTelegramEntities(sourceEntities)
    );
    const { previewMessageText, messageOptions } =
      constructPreviewMessage(
        {
          messageId: sourceMessageId,
          chatId: chat.id,
          fromUsername: chat?.username,
        },
        parsedVacancy,
        parsedEntities
      ) || {};

    const response = await ctx.editMessageText(previewMessageText, {
      ...messageOptions,
      reply_to_message_id: message_id,
    });

    logInfo(`Successfully updated vacancy preview message`);

    if (!response.message_id) {
      throw Error("preview message sending was failed");
    }

    await editNewVacancy({
      vacancy: {
        ...parsedVacancy,
        author_username: chat?.username,
        tg_message_id: response.message_id,
        tg_chat_id: response.chat.id,
        tg_parsed_entities: JSON.stringify(parsedEntities),
      },
      messageId: response.message_id,
      chatId: response.chat.id,
      fromUsername: chat?.username,
    });

    await ctx.sendMessage(parsedVacancyToReviewMessage);
  } catch (err) {
    logError(err);

    if (isTextTheSameError(err)) {
      // FIXME: add text
      await ctx.sendMessage(
        "Сообщение не было обновлено, так как текст не изменен"
      );
    } else {
      await ctx.sendMessage(systemErrorMessage);
    }
  }
};
