import {
  getMissingRequiredFieldsMessage,
  systemErrorMessage,
} from "../../constants/messages";
import { parseMessageEntities } from "../../utils/parseMessageEntities";
import logger from "../logger";
import { constructPreviewMessage } from "./constructPreviewMessage";
import { editNewVacancy } from "./editNewVacancy";
import { isRequiredVacancyFieldsFilled } from "./isRequiredVacancyFieldsFilled";
import { parseMessageToVacancy } from "./parseMessageToVacancy";

export const onRetryParsing = async (ctx) => {
  const [, messageIdToParse] = ctx?.match || [];
  const { message_id, chat, reply_to_message } =
    ctx?.update?.callback_query?.message || {};
  const { sourceMessageId, sourceText, sourceEntities } =
    reply_to_message || {};

  try {
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

    if (messageIdToParse !== sourceMessageId) {
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
      throw Error(`missing fields - ${missingFields.join(", ")}`);
    }

    const { previewMessageText, messageOptions } =
      constructPreviewMessage(
        ctx,
        parsedVacancy,
        parseMessageEntities(sourceText, sourceEntities)
      ) || {};

    const response = await ctx.editMessageText(previewMessageText, {
      ...messageOptions,
      reply_to_message_id: message_id,
    });

    logger.info(
      `Successfully updated vacancy preview message for - ${chat?.username}::${chat?.id}::${sourceMessageId}`
    );

    if (!response.message_id) {
      throw Error("preview message sending was failed");
    }

    await editNewVacancy({
      vacancy: {
        ...parsedVacancy,
        author_username: chat?.username,
        tg_message_id: response.message_id,
        tg_chat_id: response.chat.id,
      },
      messageId: response.message_id,
      chatId: response.chat.id,
      fromUsername: chat?.username,
    });
  } catch (err) {
    logger.error(
      `Failed to re-parse vacancy ${messageIdToParse}::${chat?.username} - ${
        (err as Error).message || JSON.stringify(err)
      }`
    );
  }
};
