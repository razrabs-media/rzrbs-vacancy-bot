import {
  getNextHourToPublish,
  getNextSlotToPublishVacancy,
} from "../getNextSlotToPublishVacancy";

describe("getNextSlotToPublishVacancy", () => {
  it("should return time remained until next vacancy publishing", () => {
    expect(
      getNextSlotToPublishVacancy({
        from: 10,
        currentHour: 12,
        publishInterval: 1,
        currentMinutes: 47,
      })
    ).toStrictEqual({
      hoursDiff: 0,
      hoursDiffInMs: 0,
      minutesDiff: 13,
      minutesDiffInMs: 13 * 60 * 1000,
    });

    expect(
      getNextSlotToPublishVacancy({
        from: 10,
        currentHour: 10,
        publishInterval: 2,
        currentMinutes: 0,
      })
    ).toStrictEqual({
      hoursDiff: 1,
      hoursDiffInMs: 1 * 60 * 60 * 1000,
      minutesDiff: 60,
      minutesDiffInMs: 60 * 60 * 1000,
    });

    expect(
      getNextSlotToPublishVacancy({
        from: 10,
        currentHour: 16,
        publishInterval: 5,
        currentMinutes: 30,
      })
    ).toStrictEqual({
      hoursDiff: 3,
      hoursDiffInMs: 3 * 60 * 60 * 1000,
      minutesDiff: 30,
      minutesDiffInMs: 30 * 60 * 1000,
    });

    expect(
      getNextSlotToPublishVacancy({
        from: 10,
        currentHour: 9,
        publishInterval: 5,
        currentMinutes: 30,
      })
    ).toStrictEqual({
      hoursDiff: 0,
      hoursDiffInMs: 0,
      minutesDiff: 30,
      minutesDiffInMs: 30 * 60 * 1000,
    });
  });

  describe("util/getNextHourToPublish", () => {
    it("should return next timeslot to publish vacancy TODAY", () => {
      expect(
        getNextHourToPublish({
          from: 10,
          currentHour: 10,
          publishInterval: 2,
        })
      ).toBe(12);

      expect(
        getNextHourToPublish({
          from: 10,
          currentHour: 16,
          publishInterval: 5,
        })
      ).toBe(20);

      expect(
        getNextHourToPublish({
          from: 10,
          currentHour: 12,
          publishInterval: 1,
        })
      ).toBe(13);

      expect(
        getNextHourToPublish({
          from: 10,
          currentHour: 9,
          publishInterval: 5,
        })
      ).toBe(10);
    });
  });
});
