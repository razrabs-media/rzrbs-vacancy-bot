import { Markup } from "telegraf";

import { ActionButtonLabels, BotActions } from "../../../constants/actions";
import logger from "../../logger";
import { getStructuredEditableVacancyText } from "./getStructuredEditableVacancyText";

export const updateButtonsUnderMessage = async (ctx) => {
  const { message_id, chat } = ctx?.update?.callback_query?.message || {};

  try {
    await ctx?.editMessageReplyMarkup({
      inline_keyboard: [
        [
          Markup.button.switchToCurrentChat(
            ActionButtonLabels[BotActions.EditVacancy],
            await getStructuredEditableVacancyText({
              messageId: message_id,
              chatId: chat?.id,
              fromUsername: chat?.username,
            })
          ),
          Markup.button.callback(
            ActionButtonLabels[BotActions.RevokeVacancy],
            BotActions.RevokeVacancy
          ),
        ],
      ],
    });
  } catch (err) {
    logger.error(
      `Failed to edit ${chat?.username}::${
        chat?.id
      }::${message_id} vacancy text - ${
        (err as Error).message || JSON.stringify(err)
      }`
    );
  }
};
