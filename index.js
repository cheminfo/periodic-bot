'use strict';

const fs = require('fs');
const data = require('./data.json');
const resultString = require('./resultString');
const Fuse = require('fuse.js');
const options = {
  include: ["score"],
  shouldSort: true,
  threshold: 0.8,
  location: 0,
  distance: 50,
  maxPatternLength: 20,
  keys: [
    {
      "name": "name",
      "weight": 0.2
    },
    {
      "name": "nameFR",
      "weight": 0.2
    },
    {
      "name": "symbol",
      "weight": 0.6
    }
  ]
};
const searcher = new Fuse(data, options);
const maxResults = 5;

// Telegram configuration
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
  let searchResult = searcher.search(msg.query);
  if (searchResult.length === 0) {
    bot.answerInlineQuery(msg.id, [{
      type: 'article',
      id: '1',
      title: `Element ${msg.query} not found`,
      input_message_content: {
        message_text: `Element ${msg.query} not found`,
        parse_mode: 'HTML'
      }
    }]);
  } else {
    let answerArray = new Array(Math.min(searchResult.length, maxResults));
    for (var i = 0; i < answerArray.length; i++) {
      answerArray[i] = {
        type: 'article',
        id: String(i),
        title: `${searchResult[i].item.symbol} - ${searchResult[i].item.name}`,
        input_message_content: {
          message_text: resultString(searchResult[i].item),
          parse_mode: 'HTML'
        }
      }
    }

    bot.answerInlineQuery(msg.id, answerArray);
  }
});

// Not inline rendering
// Li
bot.onText(/(^[^\/@]+)/, (msg, match) => {

  // formula calculation
  const fromId = msg.from.id;
  let searchResult = searcher.search(match[1]);
  if (searchResult.length === 0) {
    bot.sendMessage(fromId, `Element ${match[1]} not found`, {parse_mode: 'HTML'});
  } else {
    bot.sendMessage(fromId, resultString(searchResult[0].item), {parse_mode: 'HTML'});
  }
});