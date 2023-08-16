import { WeekDay } from "../../constants/common";
import { getTodayWeekDay } from "../getTodayWeekDay";

describe("getTodayWeekDay", () => {
  it.each([
    [new Date(1466424490000), WeekDay.Monday],
    [new Date(1466510890000), WeekDay.Tuesday],
    [new Date(1466597290000), WeekDay.Wednesday],
    [new Date(1466683690000), WeekDay.Thursday],
    [new Date(1466770090000), WeekDay.Friday],
    [new Date(1466856490000), WeekDay.Saturday],
    [new Date(1466942890000), WeekDay.Sunday],
    [new Date(1467029290000), WeekDay.Monday],
  ])(
    "should return today week day as WeekDay, %s => %s",
    (mockDate, weekDay) => {
      const spy = jest.spyOn(global, "Date").mockImplementation(() => mockDate);

      expect(getTodayWeekDay()).toBe(weekDay);

      spy.mockRestore();
    }
  );
});
