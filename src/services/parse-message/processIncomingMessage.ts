import { parseMessageEntities } from "../../utils/parseMessageEntities";
import { onVacancyEdit } from "../edit-vacancy";
import { logger } from "../index";
import { sendMessagePreview } from "../message-preview";
import { parseVacancyWithAI } from "./parseVacancyWithAI";

export const processIncomingMessage = async (ctx) => {
  const { message_id, from, text, chat, entities } = ctx?.update?.message || {};

  try {
    if (!message_id || !from?.username || !chat?.id) {
      throw Error("cannot retrieve required message info");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [techInfoLine, disclaimerLine, gapLine, ...updatedInfoText] =
      text.split("\n");

    // edited existing vacancy
    if (techInfoLine && techInfoLine.startsWith(`@${ctx?.botInfo?.username}`)) {
      const [, messageId] = techInfoLine.split(" > ");

      await onVacancyEdit(ctx, {
        messageId,
        updatedText: updatedInfoText.join("\n"),
      });
      return;
    }

    const parsedMessage = await parseVacancyWithAI(text);

    if (!parsedMessage) {
      throw Error("failed to parse vacancy with AI");
    }

    await sendMessagePreview(
      ctx,
      parsedMessage,
      parseMessageEntities(text, entities)
    );
  } catch (err) {
    logger.error(
      `Failed to process incoming message ${from?.username}::${
        chat?.id
      }::${message_id} - ${(err as Error)?.message || JSON.stringify(err)}`
    );
    ctx.sendMessage(
      `Не удалось распознать вакансию, попробуйте еще раз - ${
        (err as Error)?.message || JSON.stringify(err)
      }`
    );
  }
};
