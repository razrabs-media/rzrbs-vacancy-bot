import { MessageEntityType } from "./messages";

export enum WeekDay {
  Monday = "mon",
  Tuesday = "tue",
  Wednesday = "wed",
  Thursday = "thu",
  Friday = "fri",
  Saturday = "sat",
  Sunday = "sun",
}

export enum TimePeriod {
  Minutes = "mins",
  Hours = "hours",
  Days = "days",
  Weeks = "weeks",
}

export const WEEK: WeekDay[] = [
  WeekDay.Monday,
  WeekDay.Tuesday,
  WeekDay.Wednesday,
  WeekDay.Thursday,
  WeekDay.Friday,
  WeekDay.Saturday,
  WeekDay.Sunday,
];

export const SUPPORTED_MSG_ENTITIES = [MessageEntityType.TextLink];
