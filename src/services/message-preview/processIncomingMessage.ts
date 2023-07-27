import { VacancyFieldLabel } from "../../constants/labels";
import { getMissingRequiredFieldsMessage } from "../../constants/messages";
import { IVacancyParsed } from "../../types/vacancy";
import { parseMessageEntities } from "../../utils/parseMessageEntities";
import { parseNewVacancyWithAI } from "../ai/parseNewVacancyWithAI";
import { onVacancyEdit } from "../edit-vacancy";
import logger from "../logger";
import { sendMessagePreview } from "./sendMessagePreview";

export const isRequiredVacancyFieldsFilled = (
  parsedVacancy: IVacancyParsed
): { isRequiredFieldsFilled: boolean; missingFields: VacancyFieldLabel[] } => {
  if (!parsedVacancy) {
    return { isRequiredFieldsFilled: false, missingFields: [] };
  }

  const missingFields: VacancyFieldLabel[] = [];
  const {
    title,
    salary_amount_from,
    salary_amount_to,
    salary_negotiable,
    company_name,
    contact_info,
    hiring_process,
    work_experience,
  } = parsedVacancy;

  if (!title) missingFields.push(VacancyFieldLabel.Title);
  if (!company_name) missingFields.push(VacancyFieldLabel.Company);
  if (!contact_info) missingFields.push(VacancyFieldLabel.Contacts);
  if (!hiring_process) missingFields.push(VacancyFieldLabel.HiringProcess);
  if (!salary_amount_from && !salary_amount_to && !salary_negotiable)
    missingFields.push(VacancyFieldLabel.Salary);
  if (!work_experience) missingFields.push(VacancyFieldLabel.WorkExperience);

  return { isRequiredFieldsFilled: !!missingFields.length, missingFields };
};

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

    const parsedMessage = await parseNewVacancyWithAI(text);

    if (!parsedMessage) {
      await ctx.sendMessage(
        `Не удалось распознать вакансию с помощью AI, попробуйте еще раз`
      );
      throw Error("failed to parse vacancy with AI");
    }

    const { isRequiredFieldsFilled, missingFields } =
      isRequiredVacancyFieldsFilled(parsedMessage);
    if (!isRequiredFieldsFilled) {
      await ctx.sendMessage(getMissingRequiredFieldsMessage(missingFields));
      throw Error(`missing fields - ${missingFields.join(", ")}`);
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
  }
};
