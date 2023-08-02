import { Markup } from "telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";

import { ActionButtonLabels, BotActions } from "../../../constants/actions";
import { getVacancyEditButton } from "../../edit-vacancy/getVacancyEditButton";
import logger from "../../logger";

export const updateButtonsUnderMessage = async (ctx) => {
  const { message_id, chat, text } = ctx?.update?.callback_query?.message || {};

  try {
    await ctx?.editMessageReplyMarkup({
      inline_keyboard: [
        [
          await getVacancyEditButton({
            messageId: message_id,
            chatId: chat?.id,
            fromUsername: chat?.username,
            text,
          }),
          Markup.button.callback(
            ActionButtonLabels[BotActions.RevokeVacancy],
            BotActions.RevokeVacancy
          ),
        ].filter(Boolean) as InlineKeyboardButton[],
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
