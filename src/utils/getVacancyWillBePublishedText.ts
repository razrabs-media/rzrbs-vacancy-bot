import { VACANCY_WILL_BE_PUBLISHED } from "../constants/labels";

export const getVacancyWillBePublishedText = (date: Date): string =>
  `${VACANCY_WILL_BE_PUBLISHED}: ${date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Moscow",
  })}`;
