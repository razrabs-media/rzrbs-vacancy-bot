# rzrbs-vacancy-bot

## Contribution

### Getting started

1. Install dependencies with `npm install`
2. Install Git Hooks with `npx husky install`
3. Add following variables to `.env` file:

```
    NODE_ENV=<development or production>
    APP_PORT=3000
    BOT_TOKEN=<token value>
    BOT_CONTACTS=chatId1,chatId2 # contacts list of Tg chat IDs to publish vacancies to
    BOT_CONSULTANT_USERNAME=<username to show bot users for questions>
    DB_URL=<postgres://user:pass@example.com:5432/dbname>
    DB_SSL_ENABLED=<boolean> # true, by default
    OPENAI_ORGANIZATION_ID=<OpenAI Organisation ID>
    OPENAI_API_KEY=<OpenAI ApiKey>

    MIN_PUBLISH_INTERVAL=<number of hours> # the smallest interval between vacancy publishing, by default 2
    PUBLISH_INTERVAL=<number of hours> # interval between vacancy publishing, by default 5
    USER_MONTH_VACANCY_LIMIT=<number> # number of vacancies one user allowed to publish in one month, by default 1
    DAILY_VACANCY_LIMIT=<number> # number of vacancies which can be published in a day, by default 2
    PUBLISH_CONFIG='{ "mon": [10,18], "tue": [10,18], "wed": [10,18], "thu": [10,18], "fri": [10,18] }' # daily publish config in format JSON<{ "week day": [from hours, to hours] }>
```

4. Start working with `npm run dev` for local development and `npm run start` for global work

### Getting started with docker-compose

You need docker-compose version 1.29

1. Create `.env` file in project folder
2. Copy content of `.env.example` to `.env` file
3. Start docker-compose with `docker-compose up -d`
