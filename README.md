# rzrbs-vacancy-bot

## Contribution

### Getting started

1. Install dependencies with `npm install`
2. Install Git Hooks with `npx husky install`
3. Add following variables to `.env` file:

```
    BOT_TOKEN=<token value>
    DB_URL=<mongodb://...>
    PUBLISH_INTERVAL=<number of hours> # if undefined or zero publishing by timer won't work
```
