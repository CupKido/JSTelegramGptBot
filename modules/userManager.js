const UserMode = require('../models/userMode');

const initUser = (id, name) => {
    const usermode = new UserMode({
        _id: id,
        name,
        mode: models.CHAT.GPT4OMINI,
    });
    return usermode.save()
}

const getName = (ctx) => {
    return ctx.from.first_name + ' ' + ctx.from.last_name;
}

const swapToMode = (mode) => {
    return async (ctx) => {
        UserMode.findOne({ _id: ctx.from.id }).then((result) => {
            if(!result){
                initUser(ctx.from.id, getName(ctx))
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

const isUserAuthed = async (ctx) => {
    return await UserMode.findOne({ _id: ctx.from.id }).then((result) => {
        if(!result){
            initUser(ctx.from.id, getName(ctx))
            .then((result) => {
                return false;
            });
        }else{
            return result.authorized;
        }
    });
}

const doIfAuthed = (func) => {
    return async (ctx) => {
        isUserAuthed(ctx).then(async (isAuthed) => {
            if(isAuthed) {
                await func(ctx);
            }
            else {
                await ctx.reply('you are not authorized to use this command');
            }
        })
    }
} 

const isUserAdmin = async (ctx) => {
    return UserModel.findOne({ _id: ctx.from.id }).then((result) => {
        if(!result){
            initUser(ctx.from.id, getName(ctx))
            .then((result) => {
                return false;
            });
        }
        if(!result.admin){
            return false;
        }
        return true;
    });
}

const doIfAdmin = (func) => {
    return async (ctx) => {
        isUserAdmin(ctx).then(async (isAdmin) => {
            if(isAdmin) {
                await func(ctx);
            }
            else {
                await ctx.reply('you are not authorized to use this command');
            }
        });
    }
} 

module.exports = {
    initUser,
    isUserAuthed,
    doIfAuthed,
    swapToMode,
    getName,
    isUserAdmin,
    doIfAdmin,
}