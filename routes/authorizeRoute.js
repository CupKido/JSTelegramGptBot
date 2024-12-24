const UserModel = require('../models/userMode');
const { authUsers, unlimitUsers, listUsers, announce, tell, history, deAuthUsers, deUnlimitUsers } = require('../controllers/authController');

module.exports = (bot) => {
    bot.command('auth', authUsers);

    bot.command('unlimit', unlimitUsers)

    bot.command('deauth', deAuthUsers);

    bot.command('deunlimit', deUnlimitUsers)

    bot.command('listUsers', listUsers);

    bot.command('announce', announce);

    bot.command('tell', tell);

    bot.command('history', history);
}