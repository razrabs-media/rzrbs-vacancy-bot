import { Environment } from "../types/common";

export interface IConfig {
  environment?: Environment;
  botToken?: string;
  dbUrl?: string;
  dbSslEnabled: boolean;

  // contacts list of Tg chat IDs to publish vacancies to
  botContactsList: string[];
  // number of hours, if undefined or zero publishing by timer won't work
  publishInterval: number;
  // time (in minutes) between publishing vacancy of bunch of vacancies from publish queue
  minsBetweenPublishing: number;
  // number of vacancies one user allowed to publish in one month
  monthVacancyLimit: number;
}

const buildConfig = (): IConfig => ({
  environment: process.env.NODE_ENV as Environment,
  dbUrl: process.env.DB_URL,
  dbSslEnabled:
    typeof process.env.DB_SSL_ENABLED !== "undefined"
      ? process.env.DB_SSL_ENABLED === "true"
      : true,
  botToken: process.env.BOT_TOKEN,

  botContactsList: (process.env.BOT_CONTACTS || "").split(",").filter(Boolean),
  publishInterval: Number(process.env.PUBLISH_INTERVAL || 0),
  minsBetweenPublishing: Number(process.env.MINUTES_BETWEEN_PUBLISHING || 0),
  monthVacancyLimit: Number(process.env.MONTH_VACANCY_LIMIT || 1),
});

export default buildConfig();
