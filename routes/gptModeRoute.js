
const { gpt4turbomode, gpt4omode, dallemode, gpt3mode, start, help, } = require('../controllers/gptModeController');



module.exports = (bot) => {
    bot.command('gpt4', gpt4turbomode);

    bot.command('gpt4o', gpt4omode);

    bot.command('dalle', dallemode);

    bot.command('gpt3', gpt3mode);

    bot.start(start);

    bot.help(help);
}