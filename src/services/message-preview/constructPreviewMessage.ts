import { Markup } from "telegraf";
import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

import { ActionButtonLabels, BotActions } from "../../constants/actions";
import { IVacancyParsed } from "../../types/vacancy";
import { buildMessageFromVacancy } from "../../utils/buildMessageFromVacancy";
import { IParsedMessageEntity } from "../../utils/parseMessageEntities";
import logger from "../logger";

export const constructPreviewMessage = (
  ctx,
  parsedVacancy: IVacancyParsed,
  parsedEntities: IParsedMessageEntity[]
):
  | {
      previewMessageText: string;
      messageOptions: {
        parse_mode: string;
        reply_markup: Markup.Markup<InlineKeyboardMarkup>["reply_markup"];
      };
    }
  | undefined => {
  const { message_id, chat, from } = ctx?.update?.message || {};

  try {
    if (!message_id || !chat?.id || !from?.username) {
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
        `${BotActions.RetryParsing}-${message_id}`
      ),
    ]);

    logger.info(
      `Successfully constructed vacancy preview message for - ${from.username}::${chat?.id}::${message_id}`
    );

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
    logger.error(
      `Failed to create vacancy from message ${from.username}::${
        chat?.id
      }::${message_id} - ${(err as Error).message || JSON.stringify(err)}`
    );
  }
};
