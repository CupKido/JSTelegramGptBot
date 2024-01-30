const UserMode = require('../models/userMode');

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

const isAdmin = async (id) => {
    return UserModel.findOne({ _id: id }).then((result) => {
        if(!result || !result.admin){
            return false;
        }
        return true;
    });
}

const authUsers = (ctx) => {
    isAdmin(ctx.from.id).then((result) => {
        if(!result){
            ctx.reply('you are not authorized to use this command');
            return;
        }
        console.log(ctx.update.message.text);
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
}

const listUsers = (ctx) => {
    isAdmin(ctx.from.id).then((result) => {
        if(!result){
            ctx.reply('you are not authorized to use this command');
            return;
        }
        UserModel.find().then((result) => {
            ctx.reply('Users: \n' + result.map((user) => {return `\tid: ${user._id} name: ${user.name} mode: ${user.mode} authorized: ${user.authorized} admin: ${user.admin}\n`}));
        });
    });
}

module.exports = {
    authUsers,
    listUsers
}
