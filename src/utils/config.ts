import { WeekDay } from "../constants/common";
import { Environment } from "../types/common";

export interface IConfig {
  environment?: Environment;
  botToken?: string;
  dbUrl?: string;
  dbSslEnabled: boolean;

  /** contacts list of Tg chat IDs to publish vacancies to */
  botContactsList: string[];
  /** username to show bot users for questions */
  botConsultantUsername: string;
  publishConfig: {
    /**
     * daily config of vacancy publishing in format `week day => 10h - 18h`
     * Example:
     * ```
     * {
     *  mon: [10, 18], // vacancies will be published from 10am to 6pm on Monday with default interval
     *  wed: undefined, // Wednesday is day off
     * }
     * ```
     */
    schedule: Record<WeekDay, [number, number]>;
    /** number of hours, interval between vacancy publishing, by default 5 */
    publishInterval: number;
    /** number of hours, the smallest interval between vacancy publishing, by default 2 */
    minPublishInterval: number;
    /** max number of vacancies, which can be published in one day, by default 2 */
    dailyVacancyLimit: number;
    /** number of vacancies one user allowed to publish in one month, by default 1 */
    userMonthVacancyLimit: number;
  };
}

const buildConfig = (): IConfig => ({
  environment: process.env.NODE_ENV as Environment,
  dbUrl: process.env.DB_URL,
  dbSslEnabled:
    typeof process.env.DB_SSL_ENABLED !== "undefined"
      ? process.env.DB_SSL_ENABLED === "true"
      : true,
  botToken: process.env.BOT_TOKEN,
  botConsultantUsername: process.env.BOT_CONSULTANT_USERNAME || "",
  botContactsList: (process.env.BOT_CONTACTS || "").split(",").filter(Boolean),
  publishConfig: {
    schedule: JSON.parse(process.env.PUBLISH_CONFIG || "{}"),
    dailyVacancyLimit: Number(process.env.DAILY_VACANCY_LIMIT || 2),
    minPublishInterval: Number(process.env.MIN_PUBLISH_INTERVAL || 2),
    publishInterval: Number(process.env.PUBLISH_INTERVAL || 5),
    userMonthVacancyLimit: Number(process.env.USER_MONTH_VACANCY_LIMIT || 1),
  },
});

export default buildConfig();
