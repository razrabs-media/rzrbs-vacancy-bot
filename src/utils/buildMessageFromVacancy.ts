import { VacancyFieldLabel } from "../constants/labels";
import { IVacancyParsed } from "../types/vacancy";

export const buildMessageFromVacancy = ({
  title,
  description,
  company_name,
  salary_amount_from,
  salary_amount_to,
  salary_currency,
  salary_type,
  format_of_work_description,
  format_of_work_title,
  type_of_employment,
  contact_info,
  hiring_process,
  location,
}: IVacancyParsed): string => {
  const header = `${title}` + `${location ? `\n${location}` : ""}`;
  const formatOfWork =
    `${VacancyFieldLabel.FormatOfWork}: #${format_of_work_title} #${type_of_employment}\n` +
    `${format_of_work_description ? `${format_of_work_description}\n` : ""}`;
  const salaryBlock =
    salary_amount_from || salary_amount_to
      ? `${VacancyFieldLabel.Salary}: ${
          salary_amount_from
            ? `от ${salary_amount_from}${salary_currency || ""} `
            : ""
        }${
          salary_amount_to
            ? `до ${salary_amount_to}${salary_currency || ""}`
            : ""
        }${salary_type ? ` (${salary_type})` : ""}\n`
      : "";

  return (
    `${header}\n\n` +
    `${VacancyFieldLabel.Company}: ${company_name}\n` +
    `${formatOfWork}` +
    `${salaryBlock}` +
    `${VacancyFieldLabel.Contacts}: ${contact_info}\n\n` +
    `${VacancyFieldLabel.Description}: ${description}\n\n` +
    `${
      hiring_process
        ? `${VacancyFieldLabel.HiringProcess}: ${hiring_process}`
        : ""
    }`
  );
};
