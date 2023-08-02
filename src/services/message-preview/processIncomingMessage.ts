import {
  getMissingRequiredFieldsMessage,
  parsedVacancyToReviewMessage,
} from "../../constants/messages";
import { parseMessageEntities } from "../../utils/parseMessageEntities";
import { onVacancyEdit } from "../edit-vacancy";
import logger from "../logger";
import { constructPreviewMessage } from "./constructPreviewMessage";
import { createNewVacancy } from "./createNewVacancy";
import { isRequiredVacancyFieldsFilled } from "./isRequiredVacancyFieldsFilled";
import { parseMessageToVacancy } from "./parseMessageToVacancy";

const getEditedMessageInfo = (
  text: string,
  ctx
): {
  messageId?: string;
  updatedVacancyText?: string;
  isEditedExistingVacancy: boolean;
} => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [techInfoLine, disclaimerLine, gapLine, ...updatedVacancyText] =
    text?.split("\n") || [];
  const [, messageId] = techInfoLine?.split(" > ") || [];

  return {
    messageId,
    updatedVacancyText: updatedVacancyText?.join("\n"),
    isEditedExistingVacancy: techInfoLine?.startsWith(
      `@${ctx?.botInfo?.username}`
    ),
  };
};

export const processIncomingMessage = async (ctx) => {
  const { message_id, from, text, chat, entities } = ctx?.update?.message || {};

  try {
    if (!message_id || !from?.username || !chat?.id) {
      throw Error("cannot retrieve required message info");
    }

    const { messageId, updatedVacancyText, isEditedExistingVacancy } =
      getEditedMessageInfo(text, ctx);

    if (isEditedExistingVacancy && updatedVacancyText && messageId) {
      await onVacancyEdit(ctx, {
        messageId: Number(messageId),
        updatedText: updatedVacancyText,
      });
      return;
    }

    const parsedMessage = await parseMessageToVacancy(text, ctx);

    const { isRequiredFieldsFilled, missingFields } =
      isRequiredVacancyFieldsFilled(parsedMessage);

    if (!isRequiredFieldsFilled) {
      await ctx.sendMessage(getMissingRequiredFieldsMessage(missingFields));
      throw Error(`missing fields - ${missingFields.join(", ")}`);
    }

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
  } catch (err) {
    logger.error(
      `Failed to process incoming message ${from?.username}::${
        chat?.id
      }::${message_id} - ${(err as Error)?.message || JSON.stringify(err)}`
    );
  }
};
