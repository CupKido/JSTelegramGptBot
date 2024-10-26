const UserMode = require('../models/userMode');
const {models} = require('nodegptwrapper');
const {HELP_MESSAGE, ADMIN_HELP_MESSAGE} = require('../config/const_messages');
const { swapToMode, doIfAuthed, isUserAdmin, initUser, getName } = require('../modules/userManager');

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
    isUserAdmin(ctx).then((isAdmin) => {
        if(isAdmin){
            ctx.reply(HELP_MESSAGE + '\n' + ADMIN_HELP_MESSAGE);
        }else{
            ctx.reply(HELP_MESSAGE);
        }
    });
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