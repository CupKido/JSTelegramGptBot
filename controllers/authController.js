const UserMode = require('../models/userMode');
const { doIfAdmin, changeUser, applyOnUsers, getUsersIds } = require('../modules/userManager');
const { splitMessageAndReply } = require('../utils');

const authUser = async (id, value) => {
    await changeUser(id, (usermode) => { usermode.authorized = value; });
}

const unlimitUser = async (id, value) => {
    await changeUser(id, (usermode) => { usermode.unlimited = value; });
}

const authUsers = doIfAdmin(applyOnUsers(authUser, "Authed users", true))
const unlimitUsers = doIfAdmin(applyOnUsers(unlimitUser, "Unlimited users", true))
const deAuthUsers = doIfAdmin(applyOnUsers(authUser, "DeAuthed users", false))
const deUnlimitUsers = doIfAdmin(applyOnUsers(unlimitUser, "DeUnlimited users", false))

const listUsers = doIfAdmin((ctx, usermode) => {
    UserMode.find().then((result) => {
        splitMessageAndReply('Users: \n' + result.map((user) =>
             {return `\tid: ${user._id} name: ${user.name} mode: ${user.mode} authorized: ${user.authorized} admin: ${user.admin}\n`}
            ),
        3000, ctx);
    });
});

const announce = doIfAdmin((ctx, usermode) => {
    message = ctx.update.message.text.split(' ').slice(1).join(' ');
    getUsersIds().then((usersIds) => {
        ctx.reply(usersIds)
        usersIds.forEach((userId) => {
                ctx.telegram.sendMessage(userId, message)
                .then()
                .catch((error) => {console.log(error + '\nunable to send announcement to ' + userId)});
        })
    })
});

const tell = doIfAdmin((ctx, usermode) => {
    splitMessage = ctx.update.message.text.split(' ');
    if(splitMessage.length < 3){
        ctx.reply('please provide a user id and a message');
        return;
    };
    userId = splitMessage[1];
    message = splitMessage.slice(2).join(' ');
    ctx.reply('telling ' + userId + ' ' + message);
    ctx.telegram.sendMessage(userId, message).then();
});

const history = doIfAdmin(async (ctx, usermode) => {
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
});

module.exports = {
    authUsers,
    unlimitUsers,
    deAuthUsers,
    deUnlimitUsers,
    listUsers,
    announce,
    tell,
    history
}
