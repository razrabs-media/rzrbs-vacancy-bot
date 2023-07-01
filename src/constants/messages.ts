import config from "../utils/config";
import { BotCommands } from "./actions";
import { VacancyFieldLabel } from "./labels";

export const welcomeMessageText =
  `Привет! Это бот размещения вакансий в @razrabsjobs.\n` +
  `Достаточно отправить текст, чтобы я сформировал объявление, ` +
  `но убедись в наличии необходимых полей, ` +
  `указанных в шаблоне (/${BotCommands.Template}) — я проверяю каждое сообщение.\n` +
  `\n` +
  `Разместить бесплатно можно до ${config.publishConfig.userMonthVacancyLimit} ` +
  `сообщений в месяц. Я считаю по количеству объявлений от тебя и ` +
  `указананной компании. Для размещения большего ` +
  `числа вакансий, другому виду сотрудничества или, в случае ` +
  `возникновения проблем в работе со мной, — напиши админу канала.`;

export const vacancyTemplateHTMLMessageText =
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
  `<strong>${VacancyFieldLabel.Description}</strong>: Всё, что описывает вакансию, обязанности и предложения`;
