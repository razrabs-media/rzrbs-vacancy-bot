import Vacancies from "../../schemas/vacancy";
import logger from "../logger";

interface IExistingVacancy {
  chatId: number;
  messageId: number;
  updatedText: string;
}

export const onVacancyEdit = async (
  ctx,
  { chatId, messageId, updatedText }: IExistingVacancy
) => {
  const { from } = ctx?.update?.message || {};

  try {
    if (!messageId || !chatId || !from?.username) {
      throw Error(`cannot retrieve message_id, chat.id or from.username`);
    }

    logger.info(
      `Vacancy edit was triggered for ${from.username}::${chatId}::${messageId}`
    );

    const vacancy = await Vacancies.findOne({
      tg_chat_id: chatId,
      tg_message_id: messageId,
      "author.username": from.username,
    });

    if (!vacancy) {
      throw Error(`Vacancy not found`);
    }

    // TODO: parse text again

    if (vacancy.published) {
      // trigger editing in DB + change message in group
    } else {
      // trigger editing in DB
    }

    await ctx.deleteMessage();
  } catch (err) {
    logger.error(
      `Failed to edit vacancy from ${
        from?.username
      }::${chatId}::${messageId} - ${
        (err as Error)?.message || JSON.stringify(err)
      }`
    );
  }
};
