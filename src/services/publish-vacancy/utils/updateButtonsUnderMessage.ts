import { Markup } from "telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";

import { ActionButtonLabels, BotActions } from "../../../constants/actions";
import { getVacancyEditButton } from "../../edit-vacancy/getVacancyEditButton";
import { handleLogging } from "../../logger";

export const updateButtonsUnderMessage = async (ctx) => {
  const { message_id, chat, text } = ctx?.update?.callback_query?.message || {};
  const { logError } = handleLogging(
    "updateButtonsUnderMessage",
    { fromUsername: chat?.username, chatId: chat?.id, messageId: message_id },
    "Failed to edit vacancy text"
  );

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
    logError(err);
  }
};
