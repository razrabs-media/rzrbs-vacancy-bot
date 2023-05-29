import { VacancyFieldLabel } from "../../constants/labels";
import VacancyModel from "../../schemas/vacancy";
import logger from "../logger";

export const getStructuredEditableVacancyText = async ({
  messageId,
  chatId,
  fromUsername,
}: {
  messageId: number;
  chatId: number;
  fromUsername: string;
}): Promise<string> => {
  try {
    if (!chatId || !messageId || !fromUsername) {
      throw Error("cannot retrieve required info");
    }

    const vacancy = await VacancyModel.findOne({
      tg_chat_id: chatId,
      tg_message_id: messageId,
      "author.username": fromUsername,
    });

    if (!vacancy) {
      throw Error("vacancy not found");
    }

    const {
      title,
      description,
      company,
      hiring_process,
      salary,
      format_of_work,
      type_of_employment,
      location,
      desired_start_date,
      contact_info,
    } = vacancy;
    const salaryString = salary?.amount
      ? `${salary.amount?.from}-${salary.amount?.to} ${salary.currency || ""}${
          salary.type ? ` (${salary.type})` : ""
        }`
      : "";

    return (
      `> ${messageId}\nПожалуйста, не изменяйте информацию выше.\n\n` +
      `${VacancyFieldLabel.Title}: ${title}\n` +
      `${VacancyFieldLabel.Company}: ${company?.name || ""}\n` +
      `${VacancyFieldLabel.HiringProcess}: ${hiring_process || ""}\n` +
      `${VacancyFieldLabel.Salary}: ${salaryString}\n` +
      `${VacancyFieldLabel.FormatOfWork}: ${format_of_work.title}. ${
        format_of_work?.description ? format_of_work?.description : ""
      }\n` +
      `${VacancyFieldLabel.TypeOfEmployment}: ${type_of_employment}\n` +
      `${VacancyFieldLabel.Location}: ${location || ""}\n` +
      `${VacancyFieldLabel.DesiredStartDate}: ${desired_start_date || ""}\n` +
      `${VacancyFieldLabel.Contacts}: ${contact_info}\n` +
      `${VacancyFieldLabel.Description}: ${description}`
    );
  } catch (err) {
    logger.error(
      `Editable vacancy: failed to build editable ${fromUsername}::${chatId}::${messageId} vacancy text - ${
        (err as Error)?.message || JSON.stringify(err)
      }`
    );
    return "";
  }
};
