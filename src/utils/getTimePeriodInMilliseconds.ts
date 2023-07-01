import { TimePeriod } from "../constants/common";

export const getTimePeriodInMilliseconds = (
  timePeriod: number,
  periodType: TimePeriod
): number => {
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
