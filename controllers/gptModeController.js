const UserMode = require('../models/userMode');
const {models} = require('nodegptwrapper');
const {HELP_MESSAGE} = require('../config/const_messages');

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
        })
    }
} 

// mode: 'gpt3',
// authorized: false,
// admin: false
const gpt3mode = swapToMode(models.CHAT.GPT3)

const gpt4ominimode = swapToMode(models.CHAT.GPT4OMINI);

const gpt4turbomode = doIfAuthed(swapToMode(models.CHAT.GPT4TURBO));

const gpt4omode = doIfAuthed(swapToMode(models.CHAT.GPT4O));

const dallemode = doIfAuthed(swapToMode(models.IMAGE_GENERATION.DALLE3));

const gpto1mode = doIfAuthed(swapToMode(models.CHAT.O1));

const gpto1minimode = doIfAuthed(swapToMode(models.CHAT.O1MINI));

const start = (ctx) => {
    UserMode.findOne({ _id: ctx.from.id }).then((result) => {
        if(!result){
            initUser(ctx.from.id, getName(ctx))
            .then((result) => {
                ctx.reply(HELP_MESSAGE);
            });
        }
    });
}

const help = (ctx) => {
    ctx.reply(HELP_MESSAGE);
}

module.exports = {
    gpt3mode,
    gpt4ominimode,
    gpt4turbomode,
    gpt4omode,
    dallemode,
    gpto1mode,
    gpto1minimode,
    start,
    help
}