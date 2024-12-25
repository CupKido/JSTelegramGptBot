const UserMode = require('../models/userMode');
const { changeUser, applyOnUsers, getUsersIds } = require('../modules/userManager');
const { splitMessageAndReply } = require('../utils');
const {models} = require('nodegptwrapper');

const authUser = async (id, value) => {
    await changeUser(id, (usermode) => { usermode.authorized = value; });
}

const unlimitUser = async (id, value) => {
    await changeUser(id, (usermode) => { usermode.unlimited = value; });
}

const resetUserMode = async (id, value) => {
    await changeUser(id, (usermode) => { usermode.mode = models.CHAT.GPT4OMINI; });
}

const authUsers = applyOnUsers(authUser, "Authed users", true)
const unlimitUsers = applyOnUsers(unlimitUser, "Unlimited users", true)
const deAuthUsers = applyOnUsers(authUser, "DeAuthed users", false)
const limitUsers = applyOnUsers(unlimitUser, "DeUnlimited users", false)

const listUsers = (ctx, usermode) => {
    UserMode.find().then((result) => {
        splitMessageAndReply('Users: \n' + result.map((user) =>
             {return `\tid: ${user._id} name: ${user.name} mode: ${user.mode} authorized: ${user.authorized} unlimited: ${user.unlimited} admin: ${user.admin}\n`}
            ),
        3000, ctx);
    });
}

const announce = (ctx, usermode) => {
    message = ctx.update.message.text.split(' ').slice(1).join(' ');
    getUsersIds().then((usersIds) => {
        ctx.reply(usersIds)
        usersIds.forEach((userId) => {
                ctx.telegram.sendMessage(userId, message)
                .then()
                .catch((error) => {console.log(error + '\nunable to send announcement to ' + userId)});
        })
    })
}

const tell = (ctx, usermode) => {
    splitMessage = ctx.update.message.text.split(' ');
    if(splitMessage.length < 3){
        ctx.reply('please provide a user id and a message');
        return;
    };
    userId = splitMessage[1];
    message = splitMessage.slice(2).join(' ');
    ctx.reply('telling ' + userId + ' ' + message);
    ctx.telegram.sendMessage(userId, message).then();
}

const history = async (ctx, usermode) => {
    splitMessage = ctx.update.message.text.split(' ');
    if(splitMessage.length < 2){
        ctx.reply('please provide a user id');
        return;
    };
    userId = splitMessage[1];
    UserMode.findOne({ _id: userId }).then((result) => {
        if(!result){
            ctx.reply('user not found');
        }else{
            chatHistory = result.history.toString();
            splitMessageAndReply(chatHistory, 3000, ctx);
        }
    });
}

const resetUsersMode = applyOnUsers(resetUserMode, "Reset users mode", false)

module.exports = {
    authUsers,
    unlimitUsers,
    deAuthUsers,
    limitUsers,
    resetUsersMode,
    listUsers,
    announce,
    tell,
    history
}
