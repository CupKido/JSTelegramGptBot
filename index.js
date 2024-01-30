const { Telegraf } = require('telegraf')
const dotenv = require('dotenv')
dotenv.config()
const { message } = require('telegraf/filters')
const connectDB = require('./config/db');
const GptModeRoute = require('./routes/gptModeRoute');
const AuthorizeRoute = require('./routes/authorizeRoute');
const GPTRoute = require('./routes/gptRoute');
connectDB().then().catch(error => console.error(error));


// Check the connection
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
GptModeRoute(bot);
AuthorizeRoute(bot);
GPTRoute(bot);
bot.help((ctx) => ctx.reply('Send me a message and I will respond'))
bot.command('myID', (ctx) => {ctx.reply(`its ${ctx.from.id}`)})
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))