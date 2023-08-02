import { DataTypes } from "sequelize";

import db from "../connectToDatabase";
import { EmploymentType, FormatOfWork, SalaryType } from "../constants/vacancy";
import { IVacancyModel } from "../types/vacancy";

export const VacancyModel = db.define<IVacancyModel>(
  "Vacancy",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, validate: { notEmpty: true } },
    description: {
      type: DataTypes.STRING(2000),
      validate: { notEmpty: true, len: [0, 2000] },
    },
    published_tg_message_id: DataTypes.ARRAY(DataTypes.STRING),
    published_tg_chat_id: DataTypes.ARRAY(DataTypes.STRING),
    publishedAt: DataTypes.DATE,
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: { notEmpty: true },
    },
    edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: { notEmpty: true },
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: { notEmpty: true },
    },
    removed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: { notEmpty: true },
    },
    tg_message_id: { type: DataTypes.INTEGER, validate: { notEmpty: true } },
    tg_chat_id: { type: DataTypes.INTEGER, validate: { notEmpty: true } },
    hiring_process: DataTypes.STRING(500),
    location: DataTypes.STRING,
    contact_info: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    type_of_employment: {
      type: DataTypes.ENUM(...Object.values(EmploymentType)),
      validate: { notEmpty: true },
    },

    /* Salary */
    salary_amount_from: { type: DataTypes.INTEGER, validate: { min: 0 } },
    salary_amount_to: { type: DataTypes.INTEGER, validate: { min: 0 } },
    salary_currency: DataTypes.STRING,
    salary_type: { type: DataTypes.ENUM(...Object.values(SalaryType)) },
    salary_negotiable: { type: DataTypes.BOOLEAN, defaultValue: false },

    /* Format of work */
    format_of_work_title: {
      type: DataTypes.ENUM(...Object.values(FormatOfWork)),
      allowNull: false,
      validate: { notEmpty: true },
    },
    // in case we want to explain it more - like "hybrid, 2 days a week work from office"
    format_of_work_description: DataTypes.STRING,
    work_experience: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: { notEmpty: true },
    },

    company_name: { type: DataTypes.STRING, allowNull: false },
    company_description: DataTypes.STRING,

    author_username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  {
    timestamps: true,
  }
);

export default VacancyModel;
