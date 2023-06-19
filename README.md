# rzrbs-vacancy-bot

## Contribution

### Getting started

1. Install dependencies with `npm install`
2. Install Git Hooks with `npx husky install`
3. Add following variables to `.env` file:

```
    NODE_ENV=<development or production>
    BOT_TOKEN=<token value>
    BOT_CONTACTS_WHITELIST=chatId1,chatId2 # whitelist of Tg chat IDs to publish vacancies to
    DB_URL=<postgres://user:pass@example.com:5432/dbname>
    PUBLISH_INTERVAL=<number of hours> # if undefined or zero publishing by timer won't work
    MINUTES_BETWEEN_PUBLISHING=<number of minutes> # time between publishing vacancy of bunch of vacancies from publish queue
    MONTH_VACANCY_LIMIT=<integer> # by default, 1
```
