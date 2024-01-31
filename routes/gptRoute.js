const {gptResponse, gptRecognize} = require('../controllers/gptController');
const { message } = require('telegraf/filters')
module.exports = (bot) => {
    bot.on(message('text'), gptResponse);
    bot.on('photo', gptRecognize);
}