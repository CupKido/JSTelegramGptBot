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
    UserMode.findOne({ _id: ctx.from.id }).then((result) => {
        if(!result){
            initUser(ctx.from.id, getName(ctx))
            .then((result) => {
                console.log(result);
                ctx.reply('Welcome, I am gpt bot, please send a message to start!\nuse /help for more info');
            });
        }
    });
}

const help = (ctx) => {
    ctx.reply('Hello! this is a bot that lets you use ChatGPT\'s API in telegram\n\n' +
    'Commands:\n' +
    '/gpt3 - sets the mode to gpt3\n' +
    '/gpt4 - sets the mode to gpt4\n' +
    '/help - shows this message\n' +
    '/myID - shows your telegram id\n' +
    'Also, the bot supports GPT\'s vision API, so send it a picture and see what he sees!\n' +
    'if you have suggestions or issues, please contact the admin.\n' +
    '\n' +
    "NOTE that only users that have been authorized by the admin can use GPT4, so if you\'re interested, contact the admin! ( https://t.me/saarta37 )");
}

module.exports = {
    gpt4mode,
    gpt3mode,
    start,
    help
}