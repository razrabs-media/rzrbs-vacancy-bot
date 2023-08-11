import { NEGOTIABLE_SALARY, VacancyFieldLabel } from "../constants/labels";
import { MessageEntityType } from "../constants/messages";
import { IVacancyParsed } from "../types/vacancy";
import { IParsedMessageEntity } from "./parseMessageEntities";

const getSalaryInfo = ({
  salary_amount_from,
  salary_amount_to,
  salary_currency,
  salary_type,
  salary_negotiable,
}: Pick<
  IVacancyParsed,
  | "salary_amount_from"
  | "salary_amount_to"
  | "salary_currency"
  | "salary_type"
  | "salary_negotiable"
>): string => {
  if (salary_amount_from || salary_amount_to) {
    return `${VacancyFieldLabel.Salary}: ${
      salary_amount_from
        ? `от ${salary_amount_from}${salary_currency || ""} `
        : ""
    }${
      salary_amount_to ? `до ${salary_amount_to}${salary_currency || ""}` : ""
    }${salary_type ? ` (${salary_type})` : ""}\n`;
  }

  if (salary_negotiable)
    return `${VacancyFieldLabel.Salary}: ${NEGOTIABLE_SALARY}\n`;

  return "";
};

export const getVacancyMessageText = ({
  title,
  description,
  company_name,
  company_description,
  salary_amount_from,
  salary_amount_to,
  salary_currency,
  salary_type,
  salary_negotiable,
  format_of_work_description,
  format_of_work_title,
  type_of_employment,
  contact_info,
  hiring_process,
  location,
}: IVacancyParsed) => {
  return (
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
      salary_negotiable,
    })}` +
    `${VacancyFieldLabel.Contacts}: ${contact_info}\n` +
    `${
      hiring_process
        ? `${VacancyFieldLabel.HiringProcess}: ${hiring_process}\n\n`
        : ""
    }` +
    `${
      company_description
        ? `${VacancyFieldLabel.CompanyDescription}: ${company_description}\n\n`
        : ""
    }` +
    `${VacancyFieldLabel.Description}: ${description}`
  );
};

export const buildMessageFromVacancy = (
  parsedVacancy: IVacancyParsed,
  parsedEntities?: IParsedMessageEntity[]
): string => {
  let result = getVacancyMessageText(parsedVacancy);

  if (parsedEntities?.length) {
    parsedEntities.forEach(({ word, value, entity_type }) => {
      if (entity_type === MessageEntityType.TextLink) {
        result = result.replace(word, `<a href="${value}">${word}</a>`);
      }
    });
  }

  return result;
};
