
const { gpt4turbomode, gpt4omode, dallemode, gpt3mode, start, help, gpto1mode, gpto1minimode, gpt4ominimode } = require('../controllers/gptModeController');



module.exports = (bot) => {
    bot.command('gpt3', gpt3mode);
    
    bot.command('gpt4omini', gpt4ominimode)

    bot.command('gpt4o', gpt4omode);
    
    bot.command('dalle', dallemode);
    
    bot.command('gpt4', gpt4turbomode);

    bot.command('o1', gpto1mode);

    bot.command('o1mini', gpto1minimode);

    bot.start(start);

    bot.help(help);
}