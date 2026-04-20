import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import Fuse from 'fuse.js';
import TelegramBot from 'node-telegram-bot-api';

import { resultString } from './resultString.js';

const data = JSON.parse(
  readFileSync(join(import.meta.dirname, 'data.json'), 'utf8'),
);

const fuseOptions = {
  includeScore: true,
  shouldSort: true,
  threshold: 0.8,
  location: 0,
  distance: 50,
  keys: [
    { name: 'name', weight: 0.2 },
    { name: 'nameFR', weight: 0.2 },
    { name: 'symbol', weight: 0.6 },
  ],
};
const searcher = new Fuse(data, fuseOptions);
const maxResults = 5;

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_TOKEN environment variable is required');
}
const bot = new TelegramBot(token, { polling: true });

const me = await bot.getMe();
console.log(`Hi my name is ${me.username}!`);

// Inline query: "@periodic_bot Li"
bot.on('inline_query', (message) => {
  const searchResults = searcher.search(message.query);
  if (searchResults.length === 0) {
    bot.answerInlineQuery(message.id, [
      {
        type: 'article',
        id: '1',
        title: `Element ${message.query} not found`,
        input_message_content: {
          message_text: `Element ${message.query} not found`,
          parse_mode: 'HTML',
        },
      },
    ]);
    return;
  }
  const limit = Math.min(searchResults.length, maxResults);
  const answers = new Array(limit);
  for (let i = 0; i < limit; i++) {
    const { item } = searchResults[i];
    answers[i] = {
      type: 'article',
      id: String(i),
      title: `${item.symbol} - ${item.name}`,
      input_message_content: {
        message_text: resultString(item),
        parse_mode: 'HTML',
      },
    };
  }
  bot.answerInlineQuery(message.id, answers);
});

// Direct message: "Li"
bot.onText(/^(?<query>[^/@]+)/, (message, match) => {
  const fromId = message.from.id;
  const { query } = match.groups;
  const searchResults = searcher.search(query);
  if (searchResults.length === 0) {
    bot.sendMessage(fromId, `Element ${query} not found`, {
      parse_mode: 'HTML',
    });
    return;
  }
  const best = searchResults[0];
  if (best.score !== 0) {
    bot.sendMessage(
      fromId,
      `<em>Best match for </em><b>${query}</b>:\r\n${resultString(best.item)}`,
      { parse_mode: 'HTML' },
    );
  } else {
    bot.sendMessage(fromId, resultString(best.item), { parse_mode: 'HTML' });
  }
});
