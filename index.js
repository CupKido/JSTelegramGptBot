const { Telegraf } = require('telegraf')
const dotenv = require('dotenv')
dotenv.config()
const { connectDB, disconnectDB } = require('./config/db');
const GptModeRoute = require('./routes/gptModeRoute');
const AuthorizeRoute = require('./routes/authorizeRoute');
const GPTRoute = require('./routes/gptRoute');
connectDB().then().catch(error => console.error(error));


// Check the connection
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
bot.command('myID', (ctx) => {ctx.reply(`its ${ctx.from.id}`)})
GptModeRoute(bot);
AuthorizeRoute(bot);
GPTRoute(bot);
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
process.once('SIGINT', () => disconnectDB())
process.once('SIGTERM', () => disconnectDB())