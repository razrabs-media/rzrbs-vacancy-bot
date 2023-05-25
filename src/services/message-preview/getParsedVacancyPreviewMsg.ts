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
  desired_start_date,
}: IVacancyParsed): string => {
  const header =
    `${title}` +
    `${location ? `\n${location}` : ""}` +
    `${
      desired_start_date ? `\nDesired start date: ${desired_start_date}` : ""
    }`;
  const formatOfWork =
    `**Format of work:** #${format_of_work.title} #${type_of_employment}\n` +
    `${format_of_work.description ? `${format_of_work.description}\n` : ""}`;
  const salaryBlock =
    salary?.amount?.from || salary?.amount?.to
      ? `**Salary**: ${
          salary?.amount?.from
            ? `from ${salary?.amount?.from}${salary?.currency || ""} `
            : ""
        }${
          salary?.amount?.to
            ? `to ${salary?.amount?.to}${salary?.currency || ""}`
            : ""
        }\n`
      : "";

  return (
    `${header}\n\n` +
    `**Company**: ${company.name}\n` +
    `${formatOfWork}` +
    `${salaryBlock}` +
    `**Contact:** ${contact_info}\n\n` +
    `${description}\n\n` +
    `${hiring_process ? hiring_process : ""}`
  );
};
