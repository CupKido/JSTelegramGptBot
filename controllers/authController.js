const UserMode = require('../models/userMode');
const { doIfAdmin } = require('../modules/userManager');
const { splitMessageAndReply } = require('../utils');

const authUser = (id) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ _id: id }).then((result) => {
            if(!result){
                const usermode = new UserModel({
                    _id: id,
                    authorized: true,
                });
                usermode.save().then((result) => {
                    resolve(result);
                });
            }else{
                result.authorized = true;
                result.save().then((result) => {
                    resolve(result);
                });
            }
        });
    });

}



const authUsers = doIfAdmin((ctx) => { 
    const userIds = ctx.update.message.text.split(' ').slice(1);
    UserModel.find().then((result) => {
        const ids = result.map((user) => {return user._id});
        const promises = [];
        userIds.forEach((id) => {
            if(ids.includes(id)){
                promises.push(authUser(id));
            }else{
                ctx.reply('user ' + id + ' didnt send me a message');
                userIds.splice(userIds.indexOf(id), 1);
            }
        });
        Promise.all(promises).then((result) => {
            ctx.reply('Authed users: ' + userIds);
        });
    });
});

const listUsers = doIfAdmin((ctx) => {
    UserModel.find().then((result) => {
        ctx.reply('Users: \n' + result.map((user) =>
             {return `\tid: ${user._id} name: ${user.name} mode: ${user.mode} authorized: ${user.authorized} admin: ${user.admin}\n`}
            )
        );
    });
});

const getUsersIds = async () => {
    return UserMode.find({}, '_id').then((users) => {return users.map((user) => user._id)});
}

const announce = doIfAdmin((ctx) => {
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

const tell = doIfAdmin((ctx) => {
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

const history = doIfAdmin(async (ctx) => {
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
    listUsers,
    announce,
    tell,
    history
}
