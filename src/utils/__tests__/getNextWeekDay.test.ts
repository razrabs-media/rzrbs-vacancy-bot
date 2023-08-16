import { WeekDay } from "../../constants/common";
import { getNextWeekDay } from "../getNextWeekDay";

describe("getNextWeekDay", () => {
  it.each([
    [WeekDay.Monday, WeekDay.Tuesday],
    [WeekDay.Tuesday, WeekDay.Wednesday],
    [WeekDay.Wednesday, WeekDay.Thursday],
    [WeekDay.Thursday, WeekDay.Friday],
    [WeekDay.Friday, WeekDay.Saturday],
    [WeekDay.Saturday, WeekDay.Sunday],
    [WeekDay.Sunday, WeekDay.Monday],
  ])("should return next week day, for %s it's %s", (weekDay, nextWeekDay) => {
    expect(getNextWeekDay(weekDay)).toBe(nextWeekDay);
  });

  it("should throw error for unknown week day", () => {
    let error;
    let result;
    try {
      result = getNextWeekDay("unknown_week_day" as WeekDay);
    } catch (err) {
      error = err;
    }
    expect(result).toBeUndefined();
    expect(error.message).toBe("week day is unknown - unknown_week_day");
  });
});
