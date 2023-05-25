import { EmploymentType, FormatOfWork, SalaryType } from "../constants/vacancy";

interface IVacancyFlags {
  published?: boolean;
  edited?: boolean;
  revoked?: boolean;
  removed?: boolean;
}

export interface IVacancyModel extends IVacancyFlags {
  title: string;
  description: string;
  published_at?: Date;
  tg_message_id: number;
  tg_chat_id: number;
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

export interface IVacancy
  extends Omit<IVacancyModel, keyof IVacancyFlags>,
    Required<IVacancyFlags> {}

// interface is not the same with IVacancy
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IVacancyParsed
  extends Omit<IVacancy, "tg_message_id" | "tg_chat_id"> {}
