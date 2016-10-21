# periodic-bot

> [Bot's link](http://telegram.me/periodic_bot)

Telegram bot to give information about the periodic table elements.

## Install

```bash
$ npm install
```

## Production

In order to be able to run this the `TELEGRAM_TOKEN` should be set to the token provided for Telegram

```bash
$ docker pull cheminfo/periodic-bot
$ docker run -it --env TELEGRAM_TOKEN=<your token here> cheminfo/periodic-bot
```

## Related documents
  - [Telegram Bot API](https://core.telegram.org/bots/api)
  - [Telegram Bot API for NodeJS](https://github.com/yagop/node-telegram-bot-api)
