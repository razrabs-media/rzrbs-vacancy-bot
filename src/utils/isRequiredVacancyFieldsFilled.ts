import { VacancyFieldLabel } from "../constants/labels";
import { IVacancyParsed } from "../types/vacancy";

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
