import { Markup, Telegraf } from "telegraf";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";

import { ActionButtonLabels, BotActions } from "../../constants/actions";
import { textWasNotUpdatedMessage } from "../../constants/messages";
import { BotContext } from "../../types/context";
import { TelegramMessageParams } from "../../types/telegram";
import { IVacancyModel } from "../../types/vacancy";
import { buildMessageFromVacancy } from "../../utils/buildMessageFromVacancy";
import { isTextTheSameError } from "../../utils/isTextTheSameError";
import { handleLogging } from "../logger";
import { getVacancyEditButton } from "./getVacancyEditButton";

export const updatePrivateVacancyMessage = async ({
  ctx,
  chatId,
  messageId,
  fromUsername,
  vacancy,
}: {
  ctx: Telegraf<BotContext>;
  vacancy: IVacancyModel;
} & TelegramMessageParams) => {
  const { logInfo, logError } = handleLogging("updatePrivateVacancyMessage", {
    fromUsername,
    chatId,
    messageId,
  });

  try {
    const updatedInlineMarkup = Markup.inlineKeyboard(
      [
        await getVacancyEditButton({
          messageId,
          chatId,
          fromUsername,
          text: buildMessageFromVacancy(vacancy),
        }),
        Markup.button.callback(
          ActionButtonLabels[BotActions.RevokeVacancy],
          BotActions.RevokeVacancy
        ),
      ].filter(Boolean) as InlineKeyboardButton[]
    );

    await ctx.telegram.editMessageText(
      chatId,
      messageId,
      undefined,
      buildMessageFromVacancy(
        vacancy,
        JSON.parse(vacancy.tg_parsed_entities || "{}")
      ),
      updatedInlineMarkup
    );

    logInfo(`Vacancy message in private chat with bot updated`);
  } catch (err) {
    if (isTextTheSameError(err)) {
      logError(`Vacancy wasn't updated, because message is the same`);

      // @ts-expect-error: ctx.sendMessage was not specified by Telegraf.io
      await ctx.sendMessage(textWasNotUpdatedMessage);
    }
    throw err;
  }
};
