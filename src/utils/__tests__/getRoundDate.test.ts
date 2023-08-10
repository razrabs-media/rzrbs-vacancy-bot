import { getRoundDate } from "../getRoundDate";

const mockDate = new Date(1466424490000);
const spy = jest.spyOn(global, "Date").mockImplementation(() => mockDate);

describe("getRoundDate", () => {
  afterAll(() => {
    spy.mockRestore();
  });

  it("should return round date with same day, month, year if called without args", () => {
    const result = getRoundDate({});
    expect(result.toLocaleString()).toBe("6/20/2016, 12:00:00 AM");
  });

  it("should return round date with same day, month, year and given hour", () => {
    const result = getRoundDate({ hour: 14 });
    expect(result.toLocaleString()).toBe("6/20/2016, 2:00:00 PM");
  });

  it("should return round date with same day, month, year and given day", () => {
    const result = getRoundDate({ day: 14 });
    expect(result.toLocaleString()).toBe("6/14/2016, 12:00:00 AM");
  });

  it("should return round date with same month, year and added days", () => {
    const result = getRoundDate({ daysToAdd: 21 });
    expect(result.toLocaleString()).toBe("7/5/2016, 12:00:00 AM");
  });
});
