import { WeekDay } from "../constants/common";
import { handleLogging } from "../services/logger";

export const getTodayWeekDay = (): WeekDay => {
  const today = new Date();
  const [weekDay] = today.toDateString().toLowerCase().split(" ");
  const { logError } = handleLogging("getTodayWeekDay");

  if (!Object.values(WeekDay).includes(weekDay as WeekDay)) {
    logError(`${weekDay} is not recognized as Week Day`);
  }

  return weekDay as WeekDay;
};
