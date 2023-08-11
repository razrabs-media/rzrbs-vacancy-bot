import { Markup } from "telegraf";
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

import { ActionButtonLabels, BotActions } from "../../constants/actions";
import { Maybe } from "../../types/mixins";
import { TelegramMessageParams } from "../../types/telegram";
import { IVacancyParsed } from "../../types/vacancy";
import { buildMessageFromVacancy } from "../../utils/buildMessageFromVacancy";
import { IParsedMessageEntity } from "../../utils/parseMessageEntities";
import { handleLogging } from "../logger";

interface ConstructPreviewMessageResult {
  previewMessageText: string;
  messageOptions: {
    parse_mode: string;
    reply_markup: Markup.Markup<InlineKeyboardMarkup>["reply_markup"];
  };
}

export const constructPreviewMessage = (
  { chatId, messageId, fromUsername }: TelegramMessageParams,
  parsedVacancy: IVacancyParsed,
  parsedEntities: IParsedMessageEntity[]
): Maybe<ConstructPreviewMessageResult> => {
  const { logInfo, logError } = handleLogging(
    "constructPreviewMessage",
    { fromUsername, chatId, messageId },
    "Failed to create vacancy preview"
  );

  try {
    if (!messageId || !chatId || !fromUsername) {
      throw Error("cannot retrieve message_id, chat.id of from.username");
    }

    const replyMarkupButtons = Markup.inlineKeyboard([
      Markup.button.callback(
        ActionButtonLabels[BotActions.PublishVacancy],
        BotActions.PublishVacancy
      ),
      Markup.button.callback(
        ActionButtonLabels[BotActions.CancelVacancy],
        BotActions.CancelVacancy
      ),
      Markup.button.callback(
        ActionButtonLabels[BotActions.RetryParsing],
        `${BotActions.RetryParsing}-${messageId}`
      ),
    ]);

    logInfo(`Successfully constructed vacancy preview message`);

    return {
      previewMessageText: buildMessageFromVacancy(
        parsedVacancy,
        parsedEntities
      ),
      messageOptions: {
        ...replyMarkupButtons,
        parse_mode: "HTML",
      },
    };
  } catch (err) {
    logError(err);
  }
};
