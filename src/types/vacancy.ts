import { Model, Optional } from "sequelize";

import { EmploymentType, FormatOfWork, SalaryType } from "../constants/vacancy";
import { ITimestamps } from "./timestamps";

interface IVacancyFlags {
  published: boolean;
  edited: boolean;
  revoked: boolean;
  removed: boolean;
}

export type TVacancyAttributes = {
  readonly id: number;

  title: string;
  description: string;
  publishedAt?: Date;
  author_username: string;
  tg_message_id: number;
  tg_chat_id: number;
  published_tg_message_id?: string[];
  published_tg_chat_id?: string[];
  company_name: string;
  company_description?: string;
  hiring_process?: string;

  salary_amount_from?: number;
  salary_amount_to?: number;
  salary_currency?: string;
  salary_type?: SalaryType;

  format_of_work_title?: FormatOfWork;
  format_of_work_description?: string;

  type_of_employment: EmploymentType;
  location?: string;
  contact_info: string;
} & IVacancyFlags;

export interface IVacancy
  extends TVacancyAttributes,
    Optional<ITimestamps, keyof ITimestamps> {}

export type TVacancyCreationAttributes = Optional<
  TVacancyAttributes,
  keyof IVacancyFlags | "id"
>;

// same as IVacancyModel, but flags are required here (they will be created by DB)
export interface IVacancyModel
  extends Model<TVacancyAttributes, TVacancyCreationAttributes>,
    TVacancyAttributes {}

// interface is not the same with IVacancy
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IVacancyParsed
  extends Omit<
    IVacancy,
    | "tg_message_id"
    | "tg_chat_id"
    | "author_username"
    | "id"
    | keyof IVacancyFlags
  > {}
