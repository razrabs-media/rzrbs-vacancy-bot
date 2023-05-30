import { VacancyFieldLabel } from "../../constants/labels";
import { EmploymentType } from "../../constants/vacancy";
import logger from "../logger";

EmploymentType;
export const sendVacancyTemplateMessage = async (ctx) => {
  try {
    const { username } = ctx?.update?.message?.chat || {};

    logger.info(`User @${username} requests for template`);

    await ctx.reply(
      `<strong>${VacancyFieldLabel.Title}</strong>: Название должности\n` +
        `<strong>${VacancyFieldLabel.Company}</strong>: Название компании\n` +
        `<strong>${VacancyFieldLabel.Salary}</strong>: от Х до ХХХ $/€ (gross/net)\n` +
        `<strong>${VacancyFieldLabel.Location}</strong>: Расположение места работы либо офиса компании (необязательно)\n` +
        `\n` +
        `<strong>${VacancyFieldLabel.HiringProcess}</strong>: Описание процесса найма (необязательно)\n` +
        `<strong>${VacancyFieldLabel.FormatOfWork}</strong>: #hybrid or #remote or #onsite. Описание формата работы, если требуется\n` +
        `<strong>${VacancyFieldLabel.TypeOfEmployment}</strong>: #fulltime or #parttime or #contract or #internship\n` +
        `<strong>${VacancyFieldLabel.Contacts}</strong>: Любая контактная информация, по которой можно связаться о вакансии (номер телефона, почта, ник в Telegram)\n` +
        `\n` +
        `<strong>${VacancyFieldLabel.Description}</strong>: Всё, что описывает вакансию, обязанности и предложения`,
      { parse_mode: "HTML" }
    );

    logger.info(`Vacancy template successfully sent to @${username}`);
  } catch (err) {
    logger.error(
      `Failed to send message with vacancy template - ${
        (err as Error)?.message || JSON.stringify(err)
      }`
    );
  }
};
