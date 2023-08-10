import { VacancyFieldLabel } from "../../constants/labels";
import { Maybe } from "../../types/mixins";
import { IVacancyParsed } from "../../types/vacancy";
import openai from "./openai";
import { IParsedEditedVacancyByAI } from "./types";

export const parseUpdatedVacancyWithAI = async (
  messageText: string
): Promise<Maybe<IVacancyParsed>> => {
  const { data } = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "assistant",
        content: `
              For vacancy text in input below, extract the following fields
              
              Input: ${messageText}
              
              Fields:
              - vacancy_title (text from the first line, probably alike of job title)
              - company_name (text after "${VacancyFieldLabel.Company}") 
              - company_description (text describing company, from text after "${VacancyFieldLabel.CompanyDescription}" but before "${VacancyFieldLabel.Description}"
              - location (text after "${VacancyFieldLabel.Location}", extract information about office address, city or country or special restrictions to work from some country, city)
              - format_of_work_title (from text after "${VacancyFieldLabel.FormatOfWork}", hybrid or remote or onsite (if value is not in english translate into english), modify to lowercase)
              - format_of_work_description (from text after "${VacancyFieldLabel.FormatOfWork}" and after hastags)
              - contact_info (text after "${VacancyFieldLabel.Contacts}")
              - hiring_process (text after "${VacancyFieldLabel.HiringProcess}")
              - salary (from text after "${VacancyFieldLabel.Salary}", dict of salary or wage for job done as range of numbers from 0 to positive infinity (as dict of max and min) and currency and taxes (net or gross), note that "до вычета" is equal to gross and "чистыми" is equal to net)
              - salary_negotiable (set true if find "по договоренности" or "по результатам собеседования" instead of salary numbers)
              - type_of_employment (from text after "${VacancyFieldLabel.FormatOfWork}", one of the following - fulltime or parttime or contract or internship)
              - description (text strictly after "${VacancyFieldLabel.Description}:", with all newline symbols saved, please sanitize any emoji and hashtags)
              
              Valid JSON Output, omit fields that are not present, return empty response if required fields are not presented`,
      },
    ],
    temperature: 0,
  });
  const parsedVacancy = data.choices[0].message
    ? JSON.parse(data.choices[0].message.content || "{}")
    : undefined;

  if (!parsedVacancy || !Object.keys(parsedVacancy).length) {
    return undefined;
  }

  const {
    vacancy_title,
    location,
    salary,
    description,
    company_name,
    company_description,
    contact_info,
    type_of_employment,
    format_of_work_title,
    format_of_work_description,
    hiring_process,
    salary_negotiable,
    employment_details,
  } = parsedVacancy as IParsedEditedVacancyByAI;

  return {
    title: vacancy_title,
    location,
    salary_amount_from: salary?.min,
    salary_amount_to: salary?.max,
    salary_currency: salary?.currency,
    salary_type: salary?.taxes,
    description,
    company_name,
    company_description,
    type_of_employment: type_of_employment,
    contact_info,
    format_of_work_title: format_of_work_title,
    format_of_work_description:
      format_of_work_description?.description || employment_details?.type,
    hiring_process: hiring_process?.description,
    salary_negotiable,
  };
};
