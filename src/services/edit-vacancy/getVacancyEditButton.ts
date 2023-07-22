import { Markup } from "telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";

import { ActionButtonLabels, BotActions } from "../../constants/actions";
import { Environment } from "../../types/common";
import config from "../../utils/config";
import logger from "../logger";
import { getStructuredEditableVacancyText } from "../publish-vacancy/utils/getStructuredEditableVacancyText";

interface GetVacancyEditButtonParams {
  messageId: number;
  chatId: number;
  fromUsername: string;
  text?: string;
}

export const getVacancyEditButton = async ({
  messageId,
  chatId,
  fromUsername,
  text,
}: GetVacancyEditButtonParams): Promise<
  InlineKeyboardButton.SwitchInlineCurrentChatButton | undefined
> => {
  const isButtonHidden = config.environment === Environment.Prod;
  if (isButtonHidden) {
    logger.warn(
      `getVacancyEditButton: Vacancy Edit function is disabled for Prod env`
    );
    return undefined;
  }

  if (!messageId || !chatId || !fromUsername) {
    throw Error(
      `getVacancyEditButton: cannot retrieve required info - ` +
        `messageId: ${messageId}, ` +
        `chatId: ${chatId}, ` +
        `fromUsername: ${fromUsername}`
    );
  }

  return Markup.button.switchToCurrentChat(
    ActionButtonLabels[BotActions.EditVacancy],
    await getStructuredEditableVacancyText({
      messageId,
      chatId,
      fromUsername,
      text,
    })
  );
};
