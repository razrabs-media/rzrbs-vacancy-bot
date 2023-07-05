import { Environment } from "./common";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: Environment;
      APP_PORT?: string | number;
      DB_URL?: string;
      DB_SSL_ENABLED?: string;
      BOT_TOKEN?: string;
      BOT_CONTACTS?: string;
      BOT_CONSULTANT_USERNAME?: string;
      MIN_PUBLISH_INTERVAL?: string | number;
      PUBLISH_INTERVAL?: string | number;
      USER_MONTH_VACANCY_LIMIT?: string | number;
      DAILY_VACANCY_LIMIT?: string | number;
      PUBLISH_CONFIG?: string;
      OPENAI_ORGANIZATION_ID: string;
      OPENAI_API_KEY: string;
    }
  }
}
