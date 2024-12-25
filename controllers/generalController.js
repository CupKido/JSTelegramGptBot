const { Markup } = require('telegraf');
const { modeCommands, managmentCommands } = require('../routes/commandRoute');
const {HELP_MESSAGE, HELP_START, HELP_END} = require('../config/const_messages');

function getCommandButtonsForUser(usermode, commands) {
    const resultButtons = [];
    Object.keys(commands).forEach((key) => {
        if(commands[key].if(usermode)){
            resultButtons.push('/' + key)
        }
    })

    return resultButtons;
}

function constructCommandsMessage(usermode, commands) {
    let resultMessage = "";
    Object.keys(commands).forEach((key) => {
        if(commands[key].if(usermode)){
            resultMessage += `/${key} - ${commands[key].what}\n` 
        }
    })

    return resultMessage
}

const start = (ctx, usermode) => {
    ctx.reply(HELP_MESSAGE);
}

const help = async (ctx, usermode) => {
    const modeButtons = getCommandButtonsForUser(usermode, modeCommands)
    const manageButtons = getCommandButtonsForUser(usermode, managmentCommands)
    
    let resultsMessage = HELP_START + 
    constructCommandsMessage(usermode, modeCommands) + 
    '\n' +
    constructCommandsMessage(usermode, managmentCommands) +
    '\n' +
    HELP_END;
    
    await ctx.reply(resultsMessage, Markup
        .keyboard([...modeButtons, ...manageButtons])
        .oneTime()
        .resize()
    )
}

module.exports = {
    help, 
    start,
}