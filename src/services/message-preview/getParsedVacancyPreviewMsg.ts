import { VacancyFieldLabel } from "../../constants/labels";
import { IVacancyParsed } from "../../types/vacancy";

export const getParsedVacancyPreviewMsg = ({
  title,
  description,
  company,
  salary,
  format_of_work,
  type_of_employment,
  contact_info,
  hiring_process,
  location,
}: IVacancyParsed): string => {
  const header = `${title}` + `${location ? `\n${location}` : ""}`;
  const formatOfWork =
    `${VacancyFieldLabel.FormatOfWork}: #${format_of_work.title} #${type_of_employment}\n` +
    `${format_of_work.description ? `${format_of_work.description}\n` : ""}`;
  const salaryBlock =
    salary?.amount?.from || salary?.amount?.to
      ? `${VacancyFieldLabel.Salary}: ${
          salary?.amount?.from
            ? `от ${salary?.amount?.from}${salary?.currency || ""} `
            : ""
        }${
          salary?.amount?.to
            ? `до ${salary?.amount?.to}${salary?.currency || ""}`
            : ""
        }\n`
      : "";

  return (
    `${header}\n\n` +
    `${VacancyFieldLabel.Company}: ${company.name}\n` +
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
