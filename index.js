'use strict';

const fs = require('fs');
const data = require('./data.json');
const info = require('./info.json');
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
  console.log(searchResult[0]);
  if (searchResult.length === 0) {
    bot.sendMessage(fromId, `Element ${match[1]} not found`, {parse_mode: 'HTML'});
  } else {
    bot.sendMessage(fromId, resultString(searchResult[0].item), {parse_mode: 'HTML'});
  }
});

/**
 * Search the object inside the database
 * @param {object} element - Compound to render
 * @return {string} - String to render
 */
function resultString(element) {
  var result = '';
  result += `<b>${element.symbol}</b> : <em>${element.name}</em>\r\n`;
  result += `<b>Element number: </b>${element.Z}\r\n`;
  result += `<b>French name: </b>${element.nameFR}\r\n`;
  result += `<b>Atomic weight: </b>${element.atomicWeight} ${info.atomicWeight.unit}\r\n`;
  result += `<b>Melting point: </b>${element.melting} ${info.melting.unit}\r\n`;
  result += `<b>Boiling point: </b>${element.boiling} ${info.boiling.unit}\r\n`;
  result += `<b>Electronegativity: </b>${element.electronegativity}\r\n`;
  result += `<b>First ionisation energy: </b>${element.firstIonisation} ${info.firstIonisation.unit}\r\n`;
  result += `<b>Electronic configuration: </b>${element.electronConfiguration}\r\n`;
  result += `<b>First ionisation energy: </b>${element.firstIonisation} ${info.firstIonisation.unit}\r\n`;
  return result;
}