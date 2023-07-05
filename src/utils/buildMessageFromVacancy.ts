import { VacancyFieldLabel } from "../constants/labels";
import { IVacancyParsed } from "../types/vacancy";
import { IParsedMessageEntity } from "./parseMessageEntities";

const getSalaryInfo = ({
  salary_amount_from,
  salary_amount_to,
  salary_currency,
  salary_type,
}: Pick<
  IVacancyParsed,
  "salary_amount_from" | "salary_amount_to" | "salary_currency" | "salary_type"
>): string =>
  salary_amount_from || salary_amount_to
    ? `${VacancyFieldLabel.Salary}: ${
        salary_amount_from
          ? `от ${salary_amount_from}${salary_currency || ""} `
          : ""
      }${
        salary_amount_to ? `до ${salary_amount_to}${salary_currency || ""}` : ""
      }${salary_type ? ` (${salary_type})` : ""}\n`
    : "";

export const buildMessageFromVacancy = (
  {
    title,
    description,
    company_name,
    company_description,
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
  }: IVacancyParsed,
  parsedEntities?: IParsedMessageEntity[]
): string => {
  let result =
    `${title}\n\n` +
    `${VacancyFieldLabel.Company}: ${company_name}\n` +
    `${location ? `${VacancyFieldLabel.Location}: ${location}\n` : ""}` +
    `${
      VacancyFieldLabel.FormatOfWork
    }: #${format_of_work_title} #${type_of_employment}${
      format_of_work_description ? `, ${format_of_work_description}` : ""
    }\n` +
    `${getSalaryInfo({
      salary_amount_from,
      salary_amount_to,
      salary_currency,
      salary_type,
    })}` +
    `${VacancyFieldLabel.Contacts}: ${contact_info}\n` +
    `${
      hiring_process
        ? `${VacancyFieldLabel.HiringProcess}: ${hiring_process}\n\n`
        : ""
    }` +
    `${company_description ? `${company_description}\n\n` : ""}` +
    `${VacancyFieldLabel.Description}: ${description}`;

  if (parsedEntities?.length) {
    parsedEntities.forEach(({ word, value, entity_type }) => {
      if (entity_type === "text_link") {
        result = result.replace(word, `<a href="${value}">${word}</a>`);
      }
    });
  }

  return result;
};
