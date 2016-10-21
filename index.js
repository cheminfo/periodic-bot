'use strict';

const searchAndFormat = require('./searchAndFormat');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_TOKEN;

let bot = new TelegramBot(token, {polling: true});

// A very polite bot
bot.getMe().then((me) => {
    console.log('Hi my name is %s!', me.username);
});

// inline rendering
// @periodic_bot Li
bot.on('inline_query', (msg) => {
  try {
    const res_text = search(data, info, msg.query);
    bot.answerInlineQuery(msg.id, [{
      type: 'article',
      id: '1',
      title: `${msg.query} - ${res_text.name}`,
      input_message_content: {
        message_text: res_text.string,
        parse_mode: 'HTML'
      }
    }]);
  } catch (err) {
    console.log(err);
  }
});

// Not inline rendering
// Li
bot.onText(/(^[^\/@]+)/, (msg, match) => {
  // formula calculation
  const fromId = msg.from.id;
  const result = searchAndFormat(match[1]);
  bot.sendMessage(fromId, result.string, {parse_mode: 'HTML'});
});
