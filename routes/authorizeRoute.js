const UserModel = require('../models/userMode');
const { authUsers, listUsers, announce, tell, history } = require('../controllers/authController');

module.exports = (bot) => {
    bot.command('auth', authUsers);

    bot.command('listUsers', listUsers);

    bot.command('announce', announce);

    bot.command('tell', tell);

    bot.command('history', history);
}