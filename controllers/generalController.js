const { Markup } = require('telegraf');
const { modeCommands, managmentCommands } = require('../routes/commandRoute');
const {HELP_MESSAGE, ADMIN_HELP_MESSAGE} = require('../config/const_messages');

function getCommandButtonsForUser(usermode, commands) {
    const resultButtons = [];
    Object.keys(commands).forEach((key) => {
        if(commands[key].if(usermode)){
            resultButtons.push('/' + key)
        }
    })

    return resultButtons;
}

const start = (ctx, usermode) => {
    ctx.reply(HELP_MESSAGE);
}

const help = async (ctx, usermode) => {
    const modeButtons = getCommandButtonsForUser(usermode, modeCommands)
    const manageButtons = getCommandButtonsForUser(usermode, managmentCommands)
    
    let resultsMessage = HELP_MESSAGE
    if(usermode.admin){
        resultsMessage += '\n' + ADMIN_HELP_MESSAGE;
    }

    await ctx.reply(resultsMessage, Markup
        .keyboard([modeButtons, manageButtons])
        .oneTime()
        .resize()
      )
}

module.exports = {
    help, start
}