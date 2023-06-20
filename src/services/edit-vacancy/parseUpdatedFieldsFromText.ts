import { VacancyFieldLabel } from "../../constants/labels";
import {
  EmploymentType,
  FormatOfWork,
  SalaryType,
} from "../../constants/vacancy";
import { DeepPartial } from "../../types/mixins";
import { IVacancyModel } from "../../types/vacancy";
import logger from "../logger";

const getFieldByLabel = (str, label): string | undefined =>
  str?.split(`${label}: `)?.[1];

export const parseUpdatedFieldsFromText = (
  vacancy: IVacancyModel,
  updatedText: string
): DeepPartial<IVacancyModel> => {
  try {
    const [
      title,
      companyName,
      hiringProcess,
      salaryInfo,
      formatOfWorkInfo,
      typeOfEmployment,
      location,
      contactInfo,
    ] = updatedText?.split("\n") || [];

    const salaryString = getFieldByLabel(salaryInfo, VacancyFieldLabel.Salary);
    const [salaryAmount, salaryCurrency, salaryType] = salaryString
      ? salaryString?.split(" ") || []
      : [];
    const [salaryAmountFrom, salaryAmountTo] = salaryAmount?.split("-") || [];

    const formatOfWorkString = getFieldByLabel(
      formatOfWorkInfo,
      VacancyFieldLabel.FormatOfWork
    );
    const [formatOfWorkTitle, formatOfWorkDescription] =
      formatOfWorkString?.split(". ") || [];

    const parsedFields: DeepPartial<IVacancyModel> = {
      title: getFieldByLabel(title, VacancyFieldLabel.Title),
      description: getFieldByLabel(updatedText, VacancyFieldLabel.Description),
      company_name: getFieldByLabel(companyName, VacancyFieldLabel.Company),
      hiring_process: getFieldByLabel(
        hiringProcess,
        VacancyFieldLabel.HiringProcess
      ),
      salary_amount_from: Number(salaryAmountFrom) || undefined,
      salary_amount_to: Number(salaryAmountTo) || undefined,
      salary_currency: salaryCurrency,
      salary_type: salaryType
        ? (salaryType.slice(1, salaryType.length - 1) as SalaryType)
        : undefined,
      format_of_work_title: formatOfWorkTitle as FormatOfWork,
      format_of_work_description: formatOfWorkDescription,
      type_of_employment: getFieldByLabel(
        typeOfEmployment,
        VacancyFieldLabel.TypeOfEmployment
      ) as EmploymentType,
      location: getFieldByLabel(location, VacancyFieldLabel.Location),
      contact_info: getFieldByLabel(contactInfo, VacancyFieldLabel.Contacts),
    };

    return parsedFields;
  } catch (err) {
    logger.error(
      `Failed to parse edited ${vacancy?.author_username}::${
        vacancy?.tg_chat_id
      }::${vacancy?.tg_message_id} vacancy fields - ${
        (err as Error)?.message || JSON.stringify(err)
      }}`
    );
    return {};
  }
};
