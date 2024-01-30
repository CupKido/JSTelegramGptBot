const UserModel = require('../models/userMode');
const { authUsers, listUsers } = require('../controllers/authController');

module.exports = (bot) => {
    bot.command('auth', authUsers);

    bot.command('listUsers', listUsers);
}