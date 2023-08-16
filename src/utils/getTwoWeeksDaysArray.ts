import { WEEK, WeekDay } from "../constants/common";
import { getTodayWeekDay } from "./getTodayWeekDay";

export const getTwoWeeksDaysArray = (): WeekDay[] => {
  const currentWeekDayIndex = WEEK.indexOf(getTodayWeekDay());
  return [
    ...WEEK.slice(currentWeekDayIndex),
    ...WEEK,
    ...WEEK.slice(0, currentWeekDayIndex),
  ];
};
