const UserMode = require('../models/userMode');
const {models} = require('nodegptwrapper');
const {HELP_MESSAGE, ADMIN_HELP_MESSAGE} = require('../config/const_messages');
const { swapToMode, doIfInit, doIfAuthed, doIfUnlimited } = require('../modules/userManager');

const gpt3mode = doIfInit(swapToMode(models.CHAT.GPT3))

const gpt4ominimode = doIfInit(swapToMode(models.CHAT.GPT4OMINI));

const gpt4turbomode = doIfAuthed(swapToMode(models.CHAT.GPT4TURBO));

const gpt4omode = doIfAuthed(swapToMode(models.CHAT.GPT4O));

const dallemode = doIfAuthed(swapToMode(models.IMAGE_GENERATION.DALLE3));

const gpto1mode = doIfUnlimited(swapToMode(models.CHAT.O1));

const gpto1minimode = doIfAuthed(swapToMode(models.CHAT.O1MINI));

const start = doIfInit((ctx, usermode) => {
    ctx.reply(HELP_MESSAGE);
});

const help = doIfInit((ctx, usermode) => {
    console.log(usermode)
    if(usermode.admin){
        ctx.reply(HELP_MESSAGE + '\n' + ADMIN_HELP_MESSAGE);
    }else{
        ctx.reply(HELP_MESSAGE);
    }
})

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