import {
  EmploymentType,
  FormatOfWork,
  SalaryType,
} from "../../constants/vacancy";

export interface IParsedVacancyByAI {
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
  type_of_employment: EmploymentType;
  description: string[];
  location: {
    address: string;
    city: string;
    country: string;
    restrictions: string;
  }[];
  salary_negotiable?: boolean;
  work_experience?: string;
}

export interface IParsedEditedVacancyByAI
  extends Omit<
    IParsedVacancyByAI,
    "location" | "description" | "contact_info" | "company" | "vacancy_title"
  > {
  location: string;
  description: string;
  contact_info: string;
  company_name: string;
  company_description: string;
  vacancy_title: string;
}
