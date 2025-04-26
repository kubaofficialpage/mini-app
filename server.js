const express = require('express');
const { Telegraf } = require('telegraf');
const axios = require('axios');

const app = express();
const bot = new Telegraf('YOUR_BOT_TOKEN'); // Замени на свой токен

// База данных (для примера используем массив)
let records = [];

// Команда /start
bot.start((ctx) => {
  ctx.reply('Добро пожаловать! Используйте /checkin для отметки прихода и /checkout для ухода.');
});

// Отметка прихода
bot.command('checkin', (ctx) => {
  const userId = ctx.from.id;
  const time = new Date().toISOString();
  records.push({ userId, checkIn: time, checkOut: null });
  ctx.reply('✅ Вы отметили приход!');
});

// Отметка ухода
bot.command('checkout', (ctx) => {
  const userId = ctx.from.id;
  const record = records.find(r => r.userId === userId && !r.checkOut);
  if (record) {
    record.checkOut = new Date().toISOString();
    ctx.reply('🛑 Вы отметили уход!');
  } else {
    ctx.reply('❌ Сначала отметьте приход!');
  }
});

// Запуск бота
bot.launch();

// Вебхук для мини-приложения (если нужно)
app.post('/webhook', express.json(), (req, res) => {
  console.log('Данные из мини-приложения:', req.body);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Сервер запущен на порту 3000'));
