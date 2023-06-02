import {
  EmploymentType,
  FormatOfWork,
  SalaryType,
} from "../../constants/vacancy";
import { IVacancyParsed } from "../../types/vacancy";
import logger from "../logger";
import { parseCurrencyAndSalary } from "./parseCurrencyAndSalary";

export const parseVacancyFieldsTextMessage = (
  ctx,
  text: string
): IVacancyParsed => {
  logger.info(`${text.split("\n")}`);

  const splittedMessage = text.split("\n");

  logger.info(splittedMessage.length);

  const vacancy = {
    title: "",
    description: "Some description to not broke bot",
    published_at: new Date(),
    published_tg_message_id: 1,
    published_tg_chat_id: 1,
    company: {
      name: "",
    },
    hiring_process: "",
    salary: {
      amount: { from: 1, to: 1 },
      currency: "",
      type: SalaryType.Gross,
    },
    format_of_work: {
      title: FormatOfWork.Remote,
      description: "",
    },
    type_of_employment: EmploymentType.FullTime,
    location: "",
    contact_info: "",
    published: true,
    edited: true,
    revoked: false,
    removed: false,
  };

  for (const part of splittedMessage) {
    if (part.includes("Компания")) {
      const splitted = part.split("Компания");

      vacancy.company.name = splitted[1] ? splitted[1] : "-";
    }

    if (part.includes("З/П сколько и как")) {
      const { currency, salaryFrom, salaryTo } = parseCurrencyAndSalary(part);

      vacancy.salary.currency = currency;
      vacancy.salary.amount.from = salaryFrom;
      vacancy.salary.amount.to = salaryTo;

      logger.info(`salaryFrom ${salaryFrom}`);
      logger.info(`salaryTo ${salaryTo}`);
    }

    if (part.includes("Контакт:")) {
      vacancy.contact_info = part.split("Контакт:")[1];
    }

    const positionMatch = part
      .match(/Engineer|Developer|Manager|Lead|Owner|Designer|/g)
      ?.join("");
    if (positionMatch && positionMatch.length) {
      vacancy.title = part.trim();
    }
  }

  if (!vacancy.title) {
    vacancy.title = "";
  }

  if (!vacancy.contact_info) {
    vacancy.contact_info = `@${ctx?.update?.message.from.username}`;
  }

  return vacancy;
};
