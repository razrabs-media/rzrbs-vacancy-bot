import { WEEK, WeekDay } from "../constants/common";

export const getNextWeekDay = (currentWeekDay: WeekDay): WeekDay => {
  return WEEK[WEEK.indexOf(currentWeekDay) + 1];
};
