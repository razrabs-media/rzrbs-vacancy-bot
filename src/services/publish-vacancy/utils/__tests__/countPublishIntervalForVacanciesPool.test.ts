import { WeekDay } from "../../../../constants/common";
import config, { IConfig } from "../../../../utils/config";
import { getTodayWeekDay } from "../../../../utils/getTodayWeekDay";
import {
  countPublishIntervalForVacanciesPool,
  getTwoWeeksDaysArray,
} from "../countPublishIntervalForVacanciesPool";
import { getPublishQueueLength } from "../getPublishQueueLength";

jest.mock("../../../../utils/getTodayWeekDay");
jest.mock("../getPublishQueueLength");

describe("countPublishIntervalForVacanciesPool", () => {
  beforeEach(() => {
    config.publishConfig.minPublishInterval = 1;
    config.publishConfig.publishInterval = 4;
    config.publishConfig.schedule = {
      [WeekDay.Saturday]: [17, 19],
    } as IConfig["publishConfig"]["schedule"];
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should return config.publishInterval if publishQueue is empty", async () => {
    (getPublishQueueLength as jest.Mock).mockResolvedValueOnce(0);
    config.publishConfig.publishInterval = 10;

    expect(await countPublishIntervalForVacanciesPool()).toBe(10);
  });

  it("should return config.publishInterval if vacancies can be published in two weeks", async () => {
    (getPublishQueueLength as jest.Mock).mockResolvedValueOnce(4);
    config.publishConfig.publishInterval = 2;

    expect(await countPublishIntervalForVacanciesPool()).toBe(2);
  });

  it("should return interval between config.publishInterval and config.minPublishInterval if vacancies can't be published in two weeks with config.publishInterval", async () => {
    (getPublishQueueLength as jest.Mock).mockResolvedValueOnce(4);
    config.publishConfig.publishInterval = 4;

    expect(await countPublishIntervalForVacanciesPool()).toBe(2);
  });

  it("should return onfig.minPublishInterval if vacancies can't be published in two weeks even with config.minPublishInterval", async () => {
    (getPublishQueueLength as jest.Mock).mockResolvedValueOnce(100);
    config.publishConfig.publishInterval = 4;

    expect(await countPublishIntervalForVacanciesPool()).toBe(1);
  });

  it("should return config.minPublishInterval if config.publishInterval is less than minPublishInterval", async () => {
    (getPublishQueueLength as jest.Mock).mockResolvedValueOnce(0);
    config.publishConfig.publishInterval = 1;
    config.publishConfig.minPublishInterval = 10;

    expect(await countPublishIntervalForVacanciesPool()).toBe(10);
  });

  describe("util/getTwoWeeksDaysArray", () => {
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
});
