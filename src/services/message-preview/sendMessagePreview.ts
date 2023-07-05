import { Markup } from "telegraf";

import { ActionButtonLabels, BotActions } from "../../constants/actions";
import { IVacancyParsed } from "../../types/vacancy";
import { buildMessageFromVacancy } from "../../utils/buildMessageFromVacancy";
import { IParsedMessageEntity } from "../../utils/parseMessageEntities";
import logger from "../logger";
import { createNewVacancy } from "./createNewVacancy";

export const sendMessagePreview = async (
  ctx,
  parsedVacancy: IVacancyParsed,
  parsedEntities: IParsedMessageEntity[]
) => {
  const replyMarkupButtons = Markup.inlineKeyboard([
    Markup.button.callback(
      ActionButtonLabels[BotActions.PublishVacancy],
      BotActions.PublishVacancy
    ),
    Markup.button.callback(
      ActionButtonLabels[BotActions.CancelVacancy],
      BotActions.CancelVacancy
    ),
  ]);

  const { message_id, chat, from } = ctx?.update?.message || {};

  try {
    if (!message_id || !chat?.id || !from?.username) {
      throw Error("cannot retrieve message_id, chat.id of from.username");
    }

    const response = await ctx.sendMessage(
      buildMessageFromVacancy(parsedVacancy, parsedEntities),
      {
        ...replyMarkupButtons,
        parse_mode: "HTML",
      }
    );

    if (!response.message_id) {
      throw Error("preview message sending was failed");
    }

    await createNewVacancy({
      vacancy: {
        ...parsedVacancy,
        author_username: from.username,
        tg_message_id: response.message_id,
        tg_chat_id: response.chat.id,
      },
      messageId: response.message_id,
      chatId: response.chat.id,
    });
  } catch (err) {
    logger.error(
      `Failed to create vacancy from message ${from.username}::${
        chat?.id
      }::${message_id} - ${(err as Error).message || JSON.stringify(err)}`
    );
  }
};
