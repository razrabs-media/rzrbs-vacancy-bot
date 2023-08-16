import { WEEK, WeekDay } from "../constants/common";

/**
 * Returns next week day name after given one
 *
 * @param currentWeekDay {WeekDay} - short name of week day
 * @returns WeekDay, short name of week day
 *
 * @throws Error, if given param is not recognised as WeekDay
 */
export const getNextWeekDay = (currentWeekDay: WeekDay): WeekDay => {
  const weekDayIndex = WEEK.indexOf(currentWeekDay);
  if (weekDayIndex === -1)
    throw Error(`week day is unknown - ${currentWeekDay}`);
  return WEEK[(weekDayIndex + 1) % WEEK.length];
};
