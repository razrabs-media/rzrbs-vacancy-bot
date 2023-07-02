import { Environment } from "./common";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: Environment;
      APP_PORT?: string;
      DB_URL?: string;
      DB_SSL_ENABLED?: string;
      BOT_TOKEN?: string;
      BOT_CONTACTS?: string;
      MIN_PUBLISH_INTERVAL?: string;
      PUBLISH_INTERVAL?: string;
      USER_MONTH_VACANCY_LIMIT?: string;
      DAILY_VACANCY_LIMIT?: string;
      PUBLISH_CONFIG?: string;
    }
  }
}
