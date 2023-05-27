import { Markup } from "telegraf";
import { ActionButtonLabels, BotActions } from "../../constants/actions";
import logger from "../logger";

export const updateButtonsUnderMessage = async (ctx) => {
  const { message_id, chat, caption, from } =
    ctx?.update?.callback_query?.message || {};

  try {
    await ctx?.editMessageReplyMarkup({
      inline_keyboard: [
        [
          Markup.button.switchToCurrentChat(
            ActionButtonLabels[BotActions.EditVacancy],
            `${chat?.id} > ${message_id}\n${caption}`
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
      `Failed to edit ${from?.username}::${
        chat?.id
      }::${message_id} vacancy text - ${
        (err as Error).message || JSON.stringify(err)
      }`
    );
  }
};
