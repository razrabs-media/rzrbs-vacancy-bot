import { WeekDay } from "../../constants/common";
import { getTodayWeekDay } from "../getTodayWeekDay";
import { getTwoWeeksDaysArray } from "../getTwoWeeksDaysArray";

jest.mock("../getTodayWeekDay");

describe("getTwoWeeksDaysArray", () => {
  it("should return array with 14 week days name including today - %s", () => {
    (getTodayWeekDay as jest.Mock).mockReturnValueOnce(WeekDay.Saturday);

    expect(getTwoWeeksDaysArray()).toStrictEqual([
      WeekDay.Saturday,
      WeekDay.Sunday,
      WeekDay.Monday,
      WeekDay.Tuesday,
      WeekDay.Wednesday,
      WeekDay.Thursday,
      WeekDay.Friday,
      WeekDay.Saturday,
      WeekDay.Sunday,
      WeekDay.Monday,
      WeekDay.Tuesday,
      WeekDay.Wednesday,
      WeekDay.Thursday,
      WeekDay.Friday,
    ]);
  });
});
