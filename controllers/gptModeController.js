const UserMode = require('../models/userMode');
const {models} = require('nodegptwrapper');
const initUser = (id, name) => {
    const usermode = new UserMode({
        _id: id,
        name
    });
    return usermode.save()
}

const getName = (ctx) => {
    return ctx.from.first_name + ' ' + ctx.from.last_name;
}
// mode: 'gpt3',
// authorized: false,
// admin: false
const gpt4mode = (ctx) => {
    UserMode.findOne({ _id: ctx.from.id }).then((result) => {
        console.log('res', result);
        if(!result){
            initUser(ctx.from.id, getName(ctx))
            .then((result) => {
                ctx.reply('you are not authorized for gpt4 mode');
            });
        }else{
            if(result.authorized){
                result.mode = models.GPT4TURBO;
                result.save().then((result) => {
                    ctx.reply('GPT4 mode enabled!');
                });
            }
        }
    });
}

const gpt3mode = (ctx) => {
    UserMode.findOne({ _id: ctx.from.id }).then((result) => {
        console.log('res', result);
        if(!result){
            initUser(ctx.from.id, getName(ctx))
            .then((result) => {
                console.log(result);
            });
        }else{
            result.mode = models.GPT3;
            result.save().then((result) => {
                console.log(result);
            });
        }
        ctx.reply('GPT3 mode enabled!');
    }).catch((error) => {
        console.log(error);
        ctx.reply('error finding user');
    });
    
}

const start = (ctx) => {
    UserMode.findOne()
    initUser(ctx.from.id, getName(ctx))
    .then((result) => {
        console.log(result);
        ctx.reply('Welcome, I am gpt bot, please send a message to start!')
    });
}

module.exports = {
    gpt4mode,
    gpt3mode,
    start
}