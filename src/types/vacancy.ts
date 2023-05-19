import { EmploymentType, FormatOfWork, SalaryType } from "../constants/vacancy";

export interface IVacancyModel {
  title: string;
  description: string;
  published_at?: Date;
  published?: boolean;
  edited?: boolean;
  revoked?: boolean;
  tg_message_id: number;
  company: {
    name: string;
  };
  hiring_process?: string;
  salary?: {
    amount?: { from?: number; to?: number };
    currency?: string;
    type?: SalaryType;
  };
  format_of_work: {
    title: FormatOfWork;
    description?: string;
  };
  type_of_employment: EmploymentType;
  location?: string;
  desired_start_date?: Date;
  contact_info: string;
}

export interface IVacancy extends IVacancyModel {
  published: boolean;
  edited: boolean;
  revoked: boolean;
}
