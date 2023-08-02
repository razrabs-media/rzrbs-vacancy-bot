import { WeekDay } from "../../constants/common";
import { Environment } from "../../types/common";

describe("utils/config", () => {
  it("should build config with process.env variables", () => {
    jest.isolateModules(() => {
      process.env.NODE_ENV = Environment.Test;
      process.env.BOT_TOKEN = "test-token:123";
      process.env.BOT_CONTACTS = "chat1,chat2,chat3";
      process.env.MIN_PUBLISH_INTERVAL = 10;
      process.env.PUBLISH_INTERVAL = 100;
      process.env.USER_MONTH_VACANCY_LIMIT = 10;
      process.env.DAILY_VACANCY_LIMIT = 10;
      process.env.PUBLISH_CONFIG =
        '{ "mon": [10,18], "tue": [10,18], "wed": [10,18], "thu": [10,18], "fri": [10,18], "sat": [17, 18] }';
      process.env.DB_URL = "postgres://test-path:5432/mydb";
      process.env.DB_SSL_ENABLED = "false";
      process.env.OPENAI_API_KEY = "test-api-key";
      process.env.OPENAI_ORGANIZATION_ID = "test-org";

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require("../config").default;

      expect(config).toStrictEqual({
        environment: Environment.Test,
        botToken: "test-token:123",
        dbUrl: "postgres://test-path:5432/mydb",
        dbSslEnabled: false,
        botContactsList: ["chat1", "chat2", "chat3"],
        botConsultantUsername: "test_username",
        aiApiKey: "test-api-key",
        aiOrganizationId: "test-org",
        publishConfig: {
          dailyVacancyLimit: 10,
          minPublishInterval: 10,
          publishInterval: 100,
          userMonthVacancyLimit: 10,
          schedule: {
            [WeekDay.Monday]: [10, 18],
            [WeekDay.Tuesday]: [10, 18],
            [WeekDay.Wednesday]: [10, 18],
            [WeekDay.Thursday]: [10, 18],
            [WeekDay.Friday]: [10, 18],
            [WeekDay.Saturday]: [17, 18],
          },
        },
      });
    });
  });

  it("should apply default variable values for optional variables", () => {
    jest.isolateModules(() => {
      process.env.NODE_ENV = Environment.Test;
      process.env.BOT_TOKEN = "test-token:123";
      process.env.DB_URL = "postgres://test-path:5432/mydb";
      process.env.OPENAI_API_KEY = "test-api-key";
      process.env.OPENAI_ORGANIZATION_ID = "test-org";
      delete process.env.BOT_CONTACTS;
      delete process.env.MIN_PUBLISH_INTERVAL;
      delete process.env.PUBLISH_INTERVAL;
      delete process.env.USER_MONTH_VACANCY_LIMIT;
      delete process.env.DAILY_VACANCY_LIMIT;
      delete process.env.PUBLISH_CONFIG;
      delete process.env.DB_SSL_ENABLED;
      delete process.env.BOT_CONSULTANT_USERNAME;

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = require("../config").default;

      expect(config).toStrictEqual({
        environment: Environment.Test,
        botToken: "test-token:123",
        dbUrl: "postgres://test-path:5432/mydb",
        aiApiKey: "test-api-key",
        aiOrganizationId: "test-org",
        dbSslEnabled: true,
        botContactsList: [],
        botConsultantUsername: "",
        publishConfig: {
          dailyVacancyLimit: 2,
          minPublishInterval: 2,
          publishInterval: 5,
          userMonthVacancyLimit: 1,
          schedule: {},
        },
      });
    });
  });
});
