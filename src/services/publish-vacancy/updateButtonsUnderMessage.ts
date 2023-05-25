import { Markup } from "telegraf";
import { ActionButtonLabels, BotActions } from "../../constants/actions";

export const updateButtonsUnderMessage = async (ctx) => {
  await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [
        Markup.button.callback(
          ActionButtonLabels[BotActions.EditMessage],
          BotActions.EditMessage
        ),
        Markup.button.callback(
          ActionButtonLabels[BotActions.RevokeVacancy],
          BotActions.RevokeVacancy
        ),
      ],
    ],
  });
};
