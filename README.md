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
    DB_URL=<postgres://user:pass@example.com:5432/dbname>
    DB_SSL_ENABLED=<boolean> # true, by default
    PUBLISH_INTERVAL=<number of hours> # if undefined or zero publishing by timer won't work
    MINUTES_BETWEEN_PUBLISHING=<number of minutes> # time between publishing vacancy of bunch of vacancies from publish queue
    MONTH_VACANCY_LIMIT=<integer> # number of vacancies one user allowed to publish in one month, by default 1
```

### Getting started with docker-compose

You need docker-compose version 1.29

1. Create `.env` file in project folder
2. Copy content of `.env.example` to `.env` file
3. Start docker-compose with `docker-compose up -d`
