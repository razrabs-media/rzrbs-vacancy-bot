import { EditVacancyService, MessagePreviewService, logger } from "../index";

export const subscribeToTextMessage = async (ctx) => {
  const { message_id, from, text, chat } = ctx?.update?.message || {};

  try {
    if (!message_id || !from?.username || !chat?.id) {
      throw Error("cannot retrieve required message info");
    }

    const [techInfoLine, disclaimerLine, gapLine, ...updatedInfoText] =
      text.split("\n");

    // edited existing vacancy
    if (techInfoLine && techInfoLine.startsWith(`@${ctx?.botInfo?.username}`)) {
      const [, messageId] = techInfoLine.split(" > ");

      await EditVacancyService.onVacancyEdit(ctx, {
        messageId,
        updatedText: updatedInfoText.join("\n"),
      });
      return;
    }

    // here we generate vacancy text from message somehow

    await MessagePreviewService.sendMessagePreview(
      ctx /* , parsedVacancyObject: IVacancyParsed */
    );
  } catch (err) {
    logger.error(
      `Failed to process incoming message ${from?.username}::${
        chat?.id
      }::${message_id} - ${(err as Error)?.message || JSON.stringify(err)}`
    );
  }
};
