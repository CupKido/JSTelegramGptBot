const { start, help } = require('../controllers/generalController');
const { doIfUserFit } = require('../modules/userManager');
const { ifAny } = require('../modules/userQueries');
const { modeCommands, generalCommands } = require('./commandRoute');
const { initCommandsRoute } = require('./routesUtil');

module.exports = (bot) => {
    initCommandsRoute(bot, modeCommands);

    bot.start(doIfUserFit(start, ifAny));

    bot.help(doIfUserFit(help, ifAny));
}