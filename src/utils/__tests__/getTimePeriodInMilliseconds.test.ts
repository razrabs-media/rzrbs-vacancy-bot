import { TimePeriod } from "../../constants/common";
import { getTimePeriodInMilliseconds } from "../getTimePeriodInMilliseconds";

describe("utils/getTimePeriodInMilliseconds", () => {
  it.each([
    [10, TimePeriod.Minutes, 10 * 60 * 1000],
    [10, TimePeriod.Hours, 10 * 60 * 60 * 1000],
    [10, TimePeriod.Days, 10 * 24 * 60 * 60 * 1000],
    [10, TimePeriod.Weeks, 10 * 7 * 24 * 60 * 60 * 1000],
    [0, TimePeriod.Weeks, 0],
  ])(
    "should return %s %s in milliseconds = %s",
    (time, period, expectedValue) => {
      expect(getTimePeriodInMilliseconds(time, period)).toBe(expectedValue);
    }
  );

  it("should throw error if num is less that zero", () => {
    let error;
    try {
      getTimePeriodInMilliseconds(-100, TimePeriod.Hours);
    } catch (err) {
      error = err as Error;
    }
    expect(error?.message).toBe(
      "getTimePeriodInMilliseconds: time value is less than zero"
    );
  });

  it("should throw error if time period is unknown", () => {
    let error;
    try {
      getTimePeriodInMilliseconds(10, "Months" as TimePeriod);
    } catch (err) {
      error = err as Error;
    }
    expect(error?.message).toBe(
      "getTimePeriodInMilliseconds: Unknown period - Months"
    );
  });

  it.each([NaN, false, null, undefined, [], {}, "str"])(
    "should throw error if number arg is %s",
    (value) => {
      let error;
      try {
        getTimePeriodInMilliseconds(value as number, TimePeriod.Hours);
      } catch (err) {
        error = err as Error;
      }
      expect(error?.message).toBe(
        "getTimePeriodInMilliseconds: time value is not a number"
      );
    }
  );
});
