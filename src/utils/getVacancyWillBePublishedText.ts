import { VACANCY_WILL_BE_PUBLISHED } from "../constants/labels";

export const getVacancyWillBePublishedText = (date: Date): string =>
  `${VACANCY_WILL_BE_PUBLISHED}: ${date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "Europe/Moscow",
  })}`;
