import mongoose from "mongoose";
import { FormatOfWork, SalaryType } from "../constants/vacancy";
import { IVacancyModel } from "../types/vacancy";

export const VacancySchema = new mongoose.Schema<IVacancyModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: {
      username: { type: String, required: true },
    },
    published_at: Date,
    published: { type: Boolean, default: "false", required: true },
    edited: { type: Boolean, default: "false", required: true },
    revoked: { type: Boolean, default: "false", required: true },
    removed: { type: Boolean, default: "false", required: true },
    tg_message_id: { type: Number, required: true },
    tg_chat_id: { type: Number, required: true },
    published_tg_message_id: Number,
    published_tg_chat_id: Number,
    company: {
      name: { type: String, required: true },
    },
    hiring_process: String,
    salary: {
      amount: { from: { type: Number, min: 0 }, to: { type: Number, min: 0 } },
      currency: String,
      type: { type: String, enum: [SalaryType.Gross, SalaryType.Net] },
    },
    format_of_work: {
      title: {
        type: String,
        required: true,
        enum: [FormatOfWork.Hybrid, FormatOfWork.OnSite, FormatOfWork.Remote],
      },
      // in case we want to explain it more - like "hybrid, 2 days a week work from office"
      description: String,
    },
    location: String,
    desired_start_date: String,
    contact_info: { type: String, required: true },
  },
  {
    validateBeforeSave: true,
    timestamps: true,
  }
);

const VacancyModel = mongoose.model<IVacancyModel>("Vacancy", VacancySchema);

export default VacancyModel;
