import { WeekDay } from "../../../constants/common";
import config, { IConfig } from "../../../utils/config";
import * as GetTodayWeekDayModule from "../../../utils/getTodayWeekDay";
import * as GetCurrentHoursModule from "../../../utils/time";
import logger from "../../logger";
import { monitorPublishQueueByTimer } from "../monitorPublishQueueByTimer";
import { publishNextVacancyFromQueue } from "../publishNextVacancyFromQueue";

jest.mock("../../logger");
jest.mock("../publishNextVacancyFromQueue", () => ({
  publishNextVacancyFromQueue: jest.fn().mockResolvedValue(true),
}));
jest.mock("../../publish-queue/countPublishIntervalForVacanciesPool", () => ({
  countPublishIntervalForVacanciesPool: jest.fn().mockResolvedValue(2),
}));

const getTodayWeekDaySpy = jest.spyOn(GetTodayWeekDayModule, "getTodayWeekDay");
const getCurrentHoursSpy = jest.spyOn(GetCurrentHoursModule, "getCurrentHours");

const getCurrentMinutesSpy = jest
  .spyOn(GetCurrentHoursModule, "getCurrentMinutes")
  .mockReturnValue(10);

const setIntervalSpy = jest
  .spyOn(global, "setInterval")
  .mockImplementation((cb, ms) => ms as unknown as NodeJS.Timer);

describe("monitorPublishQueueByTimer", () => {
  beforeEach(() => {
    config.publishConfig.schedule = {
      [WeekDay.Monday]: [0, 23],
      [WeekDay.Wednesday]: [10, 18],
    } as IConfig["publishConfig"]["schedule"];
  });

  it("should return early and log info if today is a day off and day just started", async () => {
    getCurrentHoursSpy.mockReturnValue(0);
    getTodayWeekDaySpy.mockReturnValue(WeekDay.Saturday);

    await monitorPublishQueueByTimer();

    expect(logger.info).toHaveBeenCalledWith("Publish Queue: new day started");
    expect(logger.info).toHaveBeenCalledWith(
      "Publish Queue: Today is a day off, analyzis finished for today"
    );

    expect(publishNextVacancyFromQueue).toHaveBeenCalledTimes(0);
  });

  it("should run queue monitoring by timer", async () => {
    getCurrentHoursSpy.mockReturnValue(10);
    getTodayWeekDaySpy.mockReturnValue(WeekDay.Wednesday);

    await monitorPublishQueueByTimer();

    expect(logger.info).toHaveBeenCalledWith(
      "Vacancies will be published with 2 hours interval"
    );

    expect(publishNextVacancyFromQueue).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(
      publishNextVacancyFromQueue,
      2 * 60 * 60 * 1000
    );
  });

  describe("with initialExecution=true", () => {
    it("should return early and log info if now are not working hours yet", async () => {
      getCurrentHoursSpy.mockReturnValue(9);
      getCurrentMinutesSpy.mockReturnValueOnce(30);
      getTodayWeekDaySpy.mockReturnValue(WeekDay.Wednesday);

      await monitorPublishQueueByTimer({ initialExecution: true });

      expect(logger.info).toHaveBeenCalledWith(
        "Publish Queue: analysis wasnt't started with initial execution of monitoring, because now is outside of working hours"
      );

      expect(publishNextVacancyFromQueue).toHaveBeenCalledTimes(0);
    });

    it("should return early and log info if now are not working hours already", async () => {
      getCurrentHoursSpy.mockReturnValue(19);
      getTodayWeekDaySpy.mockReturnValue(WeekDay.Wednesday);

      await monitorPublishQueueByTimer({ initialExecution: true });

      expect(logger.info).toHaveBeenCalledWith(
        "Publish Queue: analysis wasnt't started with initial execution of monitoring, because now is outside of working hours"
      );

      expect(publishNextVacancyFromQueue).toHaveBeenCalledTimes(0);
    });

    it("should return if working day is just finished", async () => {
      getCurrentHoursSpy.mockReturnValue(18);
      getCurrentMinutesSpy.mockReturnValueOnce(30);
      getTodayWeekDaySpy.mockReturnValue(WeekDay.Wednesday);

      await monitorPublishQueueByTimer({ initialExecution: true });

      expect(logger.info).toHaveBeenCalledWith(
        "Publish Queue: analysis wasnt't started with initial execution of monitoring, because now is outside of working hours"
      );

      expect(publishNextVacancyFromQueue).toHaveBeenCalledTimes(0);
    });
  });
});
