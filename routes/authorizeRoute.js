const { managmentCommands } = require('./commandRoute');
const { initCommandsRoute } = require('./routesUtil');

module.exports = (bot) => {
    initCommandsRoute(bot, managmentCommands);
}