import {
  editingFailedMessage,
  getMissingRequiredFieldsMessage,
} from "../../constants/messages";
import Vacancies from "../../schemas/vacancy";
import { filterSupportedTelegramEntities } from "../../utils/filterSupportedTelegramEntities";
import { isRequiredVacancyFieldsFilled } from "../../utils/isRequiredVacancyFieldsFilled";
import { parseMessageEntities } from "../../utils/parseMessageEntities";
import { parseUpdatedVacancyWithAI } from "../ai/parseUpdatedVacancyWithAI";
import { handleLogging } from "../logger";
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
  const { from, chat, message_id, entities } = ctx?.update?.message || {};
  const { logInfo, logError } = handleLogging(
    "onVacancyEdit",
    { fromUsername: from?.username, chatId: chat?.id, messageId: message_id },
    "Failed to edit vacancy"
  );

  try {
    if (!messageId || !chat?.id || !from?.username) {
      throw Error(`cannot retrieve message_id, chat.id or from.username`);
    }

    logInfo(`Vacancy edit was triggered`);

    const vacancy = await Vacancies.findOne({
      where: {
        tg_chat_id: chat.id,
        tg_message_id: messageId,
        author_username: from.username,
      },
    });

    if (!vacancy) {
      throw Error(`Vacancy not found`);
    }

    const updatedVacancyFields = await parseUpdatedVacancyWithAI(updatedText);

    if (!updatedVacancyFields) {
      throw Error("failed to parse by AI");
    }

    const { isRequiredFieldsFilled, missingFields } =
      isRequiredVacancyFieldsFilled(updatedVacancyFields);

    if (!isRequiredFieldsFilled) {
      await ctx.sendMessage(getMissingRequiredFieldsMessage(missingFields));
      throw Error(`missing fields - ${missingFields.join(", ")}`);
    }

    logInfo(`Edited fields parsed, updating vacancy in DB...`);
    for (const key in updatedVacancyFields) {
      vacancy[key] = updatedVacancyFields[key];
    }
    vacancy.tg_parsed_entities = JSON.stringify(
      parseMessageEntities(
        updatedText,
        filterSupportedTelegramEntities(entities)
      )
    );

    const updatedVacancy = await vacancy.save();

    logInfo(
      `Vacancy ${vacancy.id} updated, updating message in private chat with bot...`
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
      logInfo(
        `Vacancy ${vacancy.id} is published, updating vacancy in group channel`
      );
      await updatePublicGroupVacancyMessage({ vacancy: updatedVacancy });
    }

    await vacancy.set({ edited: true });
    await vacancy.save();
    logInfo(`Vacancy ${vacancy.id} marked as edited`);

    await ctx.deleteMessage();
  } catch (err) {
    await ctx.reply(editingFailedMessage);
    await ctx.deleteMessage();

    logError(err);
  }
};
