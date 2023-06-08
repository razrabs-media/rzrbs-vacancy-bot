# rzrbs-vacancy-bot

## Contribution

### Getting started

1. Install dependencies with `npm install`
2. Install Git Hooks with `npx husky install`
3. Add following variables to `.env` file:

```
    NODE_ENV=<development or production>
    BOT_TOKEN=<token value>
    DB_URL=<mongodb://...>
    PUBLISH_INTERVAL=<number of hours> # if undefined or zero publishing by timer won't work
```
### Getting started with docker-compose

You need docker-compose version 1.29

1. Create `.env` file in project folder
2. Copy content of `.env.example` to `.env` file
3. Start docker-compose with `docker-compose up -d`
