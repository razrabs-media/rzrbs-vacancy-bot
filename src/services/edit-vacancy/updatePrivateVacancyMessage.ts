import { Markup, Telegraf } from "telegraf";

import { ActionButtonLabels, BotActions } from "../../constants/actions";
import { BotContext } from "../../types/context";
import { IVacancyModel } from "../../types/vacancy";
import { buildMessageFromVacancy } from "../../utils/buildMessageFromVacancy";
import logger from "../logger";
import { getVacancyEditButton } from "./getVacancyEditButton";

export const updatePrivateVacancyMessage = async ({
  ctx,
  chatId,
  messageId,
  fromUsername,
  vacancy,
}: {
  ctx: Telegraf<BotContext>;
  chatId: number;
  messageId: number;
  fromUsername: string;
  vacancy: IVacancyModel;
}) => {
  try {
    const updatedInlineMarkup = Markup.inlineKeyboard([
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
    ]);

    await ctx.telegram.editMessageText(
      chatId,
      messageId,
      undefined,
      buildMessageFromVacancy(vacancy),
      updatedInlineMarkup
    );

    logger.info(`Vacancy message in private chat with bot updated`);
  } catch (err) {
    const { message } = err as Error;

    if (
      message.includes(
        "specified new message content and reply markup are exactly the same as a current content and reply markup of the message"
      )
    ) {
      logger.error(`Vacancy wasn't updated, because message is the same`);
    }
    throw err;
  }
};
