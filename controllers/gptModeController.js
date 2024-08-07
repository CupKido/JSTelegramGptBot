const UserMode = require('../models/userMode');
const {models} = require('nodegptwrapper');
const {HELP_MESSAGE} = require('../config/const_messages');

const initUser = (id, name) => {
    const usermode = new UserMode({
        _id: id,
        name,
        mode: models.CHAT.GPT3,
    });
    return usermode.save()
}

const getName = (ctx) => {
    return ctx.from.first_name + ' ' + ctx.from.last_name;
}
// mode: 'gpt3',
// authorized: false,
// admin: false
const gpt4turbomode = (ctx) => {
    UserMode.findOne({ _id: ctx.from.id }).then((result) => {
        if(!result){
            initUser(ctx.from.id, getName(ctx))
            .then((result) => {
                ctx.reply('you are not authorized for gpt4 modes');
            });
        }else{
            if(result.authorized){
                result.mode = models.CHAT.GPT4TURBO;
                result.save().then((result) => {
                    ctx.reply('GPT4 turbo mode enabled!');
                });
            }
        }
    });
}

const gpt4omode = (ctx) => {
    UserMode.findOne({ _id: ctx.from.id }).then((result) => {
        if(!result){
            initUser(ctx.from.id, getName(ctx))
            .then((result) => {
                ctx.reply('you are not authorized for gpt4 modes');
            });
        }else{
            if(result.authorized){
                result.mode = models.CHAT.GPT4O;
                result.save().then((result) => {
                    ctx.reply('GPT4O mode enabled!');
                });
            }
        }
    });
}

const dallemode = (ctx) => {
    UserMode.findOne({ _id: ctx.from.id }).then((result) => {
        if(!result){
            initUser(ctx.from.id, getName(ctx))
            .then((result) => {
                ctx.reply('you are not authorized for gpt4 modes');
            });
        }else{
            if(result.authorized){
                result.mode = models.IMAGE_GENERATION.DALLE3;
                result.save().then((result) => {
                    ctx.reply('Image generation mode enabled!');
                });
            }
        }
    });
}

const gpt3mode = (ctx) => {
    UserMode.findOne({ _id: ctx.from.id }).then((result) => {
        if(!result){
            initUser(ctx.from.id, getName(ctx))
            .then((result) => {
            });
        }else{
            result.mode = models.CHAT.GPT3;
            result.save().then((result) => {
            });
        }
        ctx.reply('GPT3 mode enabled!');
    }).catch((error) => {
        console.log(error);
        ctx.reply('error finding user');
    });
    
}

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
    gpt4turbomode,
    gpt4omode,
    gpt3mode,
    dallemode,
    start,
    help
}