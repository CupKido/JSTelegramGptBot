const { AUTH_REJECT_MESSAGE } = require("../config/const_messages")
const { doIfUserFit } = require("../modules/userManager")

const initCommandsRoute = (bot, commands) => {
    Object.keys(commands).forEach((key) => {
        bot.command(key, doIfUserFit(commands[key].do, commands[key].if, AUTH_REJECT_MESSAGE))
    })
}

module.exports = {
    initCommandsRoute
}