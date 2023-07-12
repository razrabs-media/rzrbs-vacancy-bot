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
