'use strict';

const fs = require('fs');
const data = require('./data.json');
const info = require('./info.json');

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
  const result = search(data, info, match[1]);
  bot.sendMessage(fromId, result.string, {parse_mode: 'HTML'});
});

/**
 * Search the object inside the database
 * @param {object} data - Database of elements
 * @param {object} info - Database of extra data
 * @param {string} query - Name of the compound to search
 * @return {{string:string, name:string}} - string to render and the name of the compound
 */
function search(data, info, query) {
  let element = data[query.toLowerCase()];
  if (! element) {
    return {
      string: `Element ${query} not found`,
      name: 'element not found'
    };
  }

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
  return {
    string: result,
    name: element.name
  };
}