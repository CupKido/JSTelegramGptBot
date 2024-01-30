
const { gpt4mode, gpt3mode, start, photoMode } = require('../controllers/gptModeController');



module.exports = (bot) => {
    bot.command('gpt4', gpt4mode);

    bot.command('gpt3', gpt3mode);

    bot.start(start)
}