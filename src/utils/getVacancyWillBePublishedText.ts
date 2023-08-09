import { VACANCY_WILL_BE_PUBLISHED } from "../constants/labels";

export const getVacancyWillBePublishedText = (dateTime: Date): string => {
  return `${VACANCY_WILL_BE_PUBLISHED}: ${dateTime.toLocaleString()}`;
};
