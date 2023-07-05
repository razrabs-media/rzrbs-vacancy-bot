import { TimePeriod } from "../constants/common";

export const getTimePeriodInMilliseconds = (
  timePeriod: number,
  periodType: TimePeriod
): number => {
  if (typeof timePeriod !== "number" || Number.isNaN(timePeriod)) {
    throw TypeError("getTimePeriodInMilliseconds: time value is not a number");
  }

  if (timePeriod < 0) {
    throw Error("getTimePeriodInMilliseconds: time value is less than zero");
  }

  if (timePeriod === 0) {
    return 0;
  }

  let result = timePeriod * 60 * 1000;

  if (periodType === TimePeriod.Minutes) {
    return result;
  }
  result *= 60;
  if (periodType === TimePeriod.Hours) {
    return result;
  }
  result *= 24;
  if (periodType === TimePeriod.Days) {
    return result;
  }
  result *= 7;
  if (periodType === TimePeriod.Weeks) {
    return result;
  }
  throw Error(`getTimePeriodInMilliseconds: Unknown period - ${periodType}`);
};
