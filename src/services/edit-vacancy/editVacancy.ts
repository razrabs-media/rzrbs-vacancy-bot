import Vacancies from "../../schemas/vacancy";
import { IVacancy } from "../../types/vacancy";
import logger from "../logger";
import { parseUpdatedFieldsFromText } from "./parseUpdatedFieldsFromText";
import { updatePrivateVacancyMessage } from "./updatePrivateVacancyMessage";
import { updatePublicGroupVacancyMessage } from "./updatePublicGroupVacancyMessage";

interface IExistingVacancy {
  messageId: number;
  updatedText: string;
}

export const onVacancyEdit = async (
  ctx,
  { messageId, updatedText }: IExistingVacancy
) => {
  const { from, chat } = ctx?.update?.message || {};

  try {
    if (!messageId || !chat?.id || !from?.username) {
      throw Error(`cannot retrieve message_id, chat.id or from.username`);
    }

    logger.info(
      `Vacancy edit was triggered for ${from.username}::${chat.id}::${messageId}`
    );

    const vacancy = await Vacancies.findOne({
      tg_chat_id: chat.id,
      tg_message_id: messageId,
      "author.username": from.username,
    });

    if (!vacancy) {
      throw Error(`Vacancy not found`);
    }

    const updatedVacancyFields = parseUpdatedFieldsFromText(
      vacancy,
      updatedText
    );

    logger.info(`Edited fields parsed, updating vacancy in DB...`);
    for (const key in updatedVacancyFields) {
      vacancy[key] = updatedVacancyFields[key];
    }
    const updatedVacancy = (await vacancy.save()) as IVacancy;

    logger.info(
      `Vacancy updated, updating message in private chat with bot...`
    );
    await updatePrivateVacancyMessage({
      ctx,
      chatId: chat.id,
      messageId,
      fromUsername: from.username,
      vacancy: updatedVacancy,
    });

    // change message in group
    if (vacancy.published) {
      logger.info(`Vacancy is published, updating vacancy in group channel`);
      await updatePublicGroupVacancyMessage({ ctx, vacancy: updatedVacancy });
    }

    await ctx.deleteMessage();
  } catch (err) {
    const errMessage = (err as Error)?.message || JSON.stringify(err);

    await ctx.reply(
      `Не удалось отредактировать вакансию, попробуйте еще раз - ${errMessage}`
    );
    await ctx.deleteMessage();

    logger.error(
      `Failed to edit vacancy from ${from?.username}::${chat?.id}::${messageId} - ${errMessage}`
    );
  }
};