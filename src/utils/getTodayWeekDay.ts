import { WeekDay } from "../constants/common";
import { logger } from "../services";

export const getTodayWeekDay = (): WeekDay => {
  const today = new Date();
  const [weekDay] = today.toDateString().toLowerCase().split(" ");

  if (!Object.values(WeekDay).includes(weekDay as WeekDay)) {
    logger.error(`Error: ${weekDay} is not recognized as Week Day`);
  }

  return weekDay as WeekDay;
};
