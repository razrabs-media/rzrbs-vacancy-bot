import { TimePeriod } from "../../../constants/common";
import { getTimePeriodInMilliseconds } from "../../../utils/getTimePeriodInMilliseconds";

interface IGetNextHourToPublish {
  from: number;
  publishInterval: number;
  currentHour: number;
}
export const getNextHourToPublish = ({
  from,
  publishInterval,
  currentHour,
}: IGetNextHourToPublish): number => {
  if (from > currentHour) {
    return from;
  }

  let res = from + publishInterval;
  while (res < currentHour + 1) {
    res += publishInterval;
  }
  return res;
};

interface IGetNextSlotToPublishVacancy extends IGetNextHourToPublish {
  currentMinutes: number;
}
interface IGetNextSlotToPublishVacancyResult {
  hoursDiff: number;
  hoursDiffInMs: number;
  minutesDiff: number;
  minutesDiffInMs: number;
}
export const getNextSlotToPublishVacancy = ({
  currentHour,
  from,
  publishInterval,
  currentMinutes,
}: IGetNextSlotToPublishVacancy): IGetNextSlotToPublishVacancyResult => {
  const nextHourToPublish = getNextHourToPublish({
    from,
    currentHour,
    publishInterval,
  });
  const hoursDiff = nextHourToPublish - currentHour - 1;
  const hoursDiffInMs = getTimePeriodInMilliseconds(
    hoursDiff,
    TimePeriod.Hours
  );

  const minutesDiff = 60 - currentMinutes;
  const minutesDiffInMs = getTimePeriodInMilliseconds(
    minutesDiff,
    TimePeriod.Minutes
  );

  return {
    hoursDiff,
    hoursDiffInMs,
    minutesDiff,
    minutesDiffInMs,
  };
};
