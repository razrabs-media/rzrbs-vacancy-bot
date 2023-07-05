import {
  EmploymentType,
  FormatOfWork,
  SalaryType,
} from "../../constants/vacancy";
import openai from "../ai";

interface IParsedVacancyByAI {
  company: {
    name: string;
    description: string;
  };
  format_of_work_title: FormatOfWork;
  format_of_work_description: {
    description: string;
  };
  employment_details: {
    type: string;
  };
  vacancy_title: {
    title: string;
  };
  contact_info: {
    telegram?: string;
    email?: string;
  };
  hiring_process: {
    description?: string;
  };
  salary: {
    min: number;
    max: number;
    currency: string;
    taxes: SalaryType;
    bonus?: unknown;
  };
  hashtags: string[];
  type_of_employment: EmploymentType;
  description: string[];
  //   forbidden_location: {
  //     city: string;
  //     country: string;
  //   }[];
  location: {
    address: string;
    city: string;
    country: string;
    restrictions: string;
  }[];
}

export const parseVacancyWithAI = async (messageText: string) => {
  console.log({ messageText });
  const { data } = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "assistant",
        content: `
              For vacancy text in input below, extract the following fields
              
              Input: ${messageText}
              
              Fields:
              - company (dict of company name and description)
              - location (array of information about office address, city or country or special restrictions to work from some country, city)
            ${
              /*`//   - location (array of dicts of full address, city, country if present)
      //   - forbidden_location (array of dicts of city, country which are restricted or partially restricted or forbidden if present)`*/ ""
            }
              - vacancy_title (dict of job title)
              - employment_details (dict of employment type as employee by local laws or as individual entrepreneur or as b2b if present)
              - format_of_work_title (hybrid or remote or on-site (if value is not in english translate into english), modify to lowercase)
              - format_of_work_description (dict of any details about work from office or home and employment process information by local laws (for example "по ТК РФ") or individual entrepreneur or b2b) (if present)
              - contact_info (dict of mobile and landline phone numbers if present, or telegram nickname (add @ before it) or email address or full site url)
              - hiring_process (dict of description of hiring process, if present)
              - salary (dict of salary or wage for job done as range of numbers from 0 to positive infinity (as dict of max and min) and currency and taxes (net or gross), note that "до вычета" is equal to gross and "чистыми" is equal to net)
              - type_of_employment (fulltime or parttime or contract or internship)
              - hashtags (array of hashtags (words started from #) if present)
              - description (array of the rest of the information about skills, offers, job information, benefits, bonuses as a text with all newline symbols saved)
              
              Valid JSON Output, omit fields that are not present, return empty response if required fields are not presented`,
      },
    ],
    temperature: 0,
  });
  const parsedVacancy = data.choices[0].message
    ? (JSON.parse(
        data.choices[0].message.content || "{}"
      ) as IParsedVacancyByAI)
    : undefined;

  console.log({
    response: data,
    choises: data.choices.map(({ message }) => message),
    parsedVacancy,
    location: parsedVacancy?.location,
    // forbidden_location: parsedVacancy?.forbidden_location,
    salary: parsedVacancy?.salary,
    bonus: parsedVacancy?.salary?.bonus,
  });

  if (!parsedVacancy) {
    return undefined;
  }

  const {
    vacancy_title,
    location,
    // forbidden_location,
    salary,
    description,
    company,
    contact_info,
    type_of_employment,
    format_of_work_title,
    format_of_work_description,
    hiring_process,
    hashtags,
    employment_details,
  } = parsedVacancy;

  return {
    title: vacancy_title.title,
    location: location
      ?.map(({ country, city, restrictions, address }) =>
        [
          country,
          city,
          address,
          restrictions
            ? `\nОграничения по локации: ${restrictions}`
            : undefined,
        ].filter(Boolean)
      )
      .join(", "),
    //     .join(", ") +
    //   `\nОграничения по локации: ${forbidden_location?.map(
    //     ({ country, city }) => `${country ? `${country}, ` : ""}${city}`
    //   )}`,
    salary_amount_from: salary?.min,
    salary_amount_to: salary?.max,
    salary_currency: salary.currency,
    salary_type: salary.taxes,
    description:
      description?.join("\n") ||
      "" + `\n${hashtags?.map((w) => `#${w}`).join(" ")}`,
    company_name: company.name,
    company_description: company.description,
    type_of_employment: type_of_employment,
    contact_info: [contact_info.telegram, contact_info.email]
      .filter(Boolean)
      .join(", "),
    format_of_work_title: format_of_work_title,
    format_of_work_description:
      format_of_work_description.description || employment_details.type,
    hiring_process: hiring_process?.description,
  };
};
