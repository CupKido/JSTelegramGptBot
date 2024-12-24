const { AUTH_REJECT_MESSAGE } = require('../config/const_messages');
const UserMode = require('../models/userMode');
const {models} = require('nodegptwrapper');

const initUser = async (id, name) => {
    const usermode = new UserMode({
        _id: id,
        name,
        mode: models.CHAT.GPT4OMINI,
    });
    await usermode.save()
    return usermode;
}

const findAndConfirmInit = async (from) => {
    return await UserMode.findOne({ _id: from.id }).then(async (result) => {
        if(!result){
            return await initUser(from.id, getName(from))
        }

        return result;
    });
}

const getUser = async (id) => {
    return await UserMode.findOne({ _id: id })
}

const deleteUser = async (id) => {
    await UserMode.deleteOne({ _id: id });
}

const getName = (from) => {
    return from.first_name + ' ' + from.last_name;
}

const swapToMode = (mode) => {
    return async (ctx, usermode) => {
        usermode.moded = mode;
        usermode.save();
        UserMode.findOne({ _id: ctx.from.id }).then((result) => {
            if(!result){
                initUser(ctx.from.id, getName(ctx.from))
                .then((result) => {
                });
            }else{
                result.mode = mode;
                result.save().then((result) => {
                });
            }
            ctx.reply(mode + ' mode enabled!');
        }).catch((error) => {
            console.log(error);
            ctx.reply('error finding user');
        });
    }
}

const doIfUserFit = (funcToDo, predicate, rejectMessage) => {
    return async (ctx) => {
        const usermode = await findAndConfirmInit(ctx.from);
        if(predicate(usermode)){
            await funcToDo(ctx, usermode);
        }
        else {
            await ctx.reply(rejectMessage);
        }
    }
}

const doIfInit = (funcToDo) => {
    return doIfUserFit(funcToDo, (user) => true, AUTH_REJECT_MESSAGE)
}

const doIfAuthed = (funcToDo) => {
    return doIfUserFit(funcToDo, (user) => user.authorized, AUTH_REJECT_MESSAGE)
} 

const doIfUnlimited = (funcToDo) => {
    return doIfUserFit(funcToDo, (user) => user.unlimited, AUTH_REJECT_MESSAGE)
} 

const doIfAdmin = (funcToDo) => {
    return doIfUserFit(funcToDo, (user) => user.admin, AUTH_REJECT_MESSAGE)
} 

const changeUser = async (id, userChangingFunc) => {
    const usermode = await UserMode.findOne({ _id: id });
    if(usermode) {
        userChangingFunc(usermode);
        await usermode.save();
    }
}

const changeUserWithInit = async (from, userChangingFunc) => {
    const usermode = await UserMode.findOne({ _id: from.id }).then(async (result) => {
        if(!result){
            return await initUser(from.id, getName(from))
        }

        return result;
    });

    userChangingFunc(usermode);
    await usermode.save();
}

const getUsersIds = async () => {
    return await UserMode.find({}, '_id').then((users) => {return users.map((user) => user._id)});
}

const applyOnUsers = (funcToApply, message, value) => {
    return async (ctx, usermode) => {
        const userIds = ctx.update.message.text.split(' ').slice(1);
        getUsersIds().then((ids) => {
            const promises = [];
            userIds.forEach((id) => {
                if(ids.includes(id)){
                    promises.push(new Promise(async (resolve, reject) => {
                        resolve(await funcToApply(id, value));
                    }));
                }else{
                    ctx.reply('user ' + id + ' didnt send me a message');
                    userIds.splice(userIds.indexOf(id), 1);
                }
            });
            Promise.all(promises).then((result) => {
                ctx.reply(message + ': ' + userIds);
            });
        });
    }
}

module.exports = {
    initUser,
    getUser,
    getUsersIds,
    deleteUser,
    doIfInit,
    doIfAuthed,
    doIfUnlimited,
    swapToMode,
    getName,
    doIfAdmin,
    changeUserWithInit,
    changeUser,
    applyOnUsers
}