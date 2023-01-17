const TelegramBot = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options')

const token = "5812911863:AAFyK9pRj1xgb6CSHrqRfOqpp_u4_kl8kQs";

const bot = new TelegramBot(token, {polling: true});

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 1 до 10 а ты отгадай`)
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `Отгадывай`, gameOptions )
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Информация о пользователе'},
    {command: '/game', description: 'Игра отгадай число'},
  ])
  
  bot.on('message', async msg => {
  
    const text = msg.text
    const chatId = msg.chat.id
  
    if(text === '/start'){
      await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/7e8/aa6/7e8aa67b-ad91-4d61-8f62-301bde115989/256/1.webp')
      return bot.sendMessage(chatId, `Добро пожаловать в мой телеграм бот`)
    }
    if(text === '/info'){
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if(text === '/game'){
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, `Я тебя не понимаю красавичик`)
  });

  bot.on('callback_query', msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if(data === '/again'){
      return startGame(chatId)
    }
    if(data === chats[chatId]){
      return bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
    }
    else {
      return bot.sendMessage(chatId, `Ты не угадал, бот загада цифру ${chats[chatId]}`, againOptions)
    }

    bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
  })



}

start()
