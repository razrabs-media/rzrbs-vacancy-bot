import { VacancyFieldLabel } from "../../../constants/labels";
import VacancyModel from "../../../schemas/vacancy";
import logger from "../../logger";

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
      where: {
        tg_chat_id: chatId,
        tg_message_id: messageId,
        author_username: fromUsername,
      },
    });

    if (!vacancy) {
      throw Error("vacancy not found");
    }

    const {
      title,
      description,
      company_name,
      hiring_process,
      salary_amount_from,
      salary_amount_to,
      salary_currency,
      salary_type,
      format_of_work_description,
      format_of_work_title,
      type_of_employment,
      location,
      contact_info,
    } = vacancy;
    const salaryString =
      salary_amount_from || salary_amount_to
        ? `${salary_amount_from}-${salary_amount_to} ${salary_currency || ""}${
            salary_type ? ` (${salary_type})` : ""
          }`
        : "";

    return (
      `> ${messageId}\nПожалуйста, не изменяйте информацию выше.\n\n` +
      `${VacancyFieldLabel.Title}: ${title}\n` +
      `${VacancyFieldLabel.Company}: ${company_name || ""}\n` +
      `${VacancyFieldLabel.HiringProcess}: ${hiring_process || ""}\n` +
      `${VacancyFieldLabel.Salary}: ${salaryString}\n` +
      `${VacancyFieldLabel.FormatOfWork}: ${format_of_work_title}. ${
        format_of_work_description || ""
      }\n` +
      `${VacancyFieldLabel.TypeOfEmployment}: ${type_of_employment}\n` +
      `${VacancyFieldLabel.Location}: ${location || ""}\n` +
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
