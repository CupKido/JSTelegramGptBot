const {models} = require('nodegptwrapper');
const { swapToMode } = require('../modules/userManager');


const gpt3mode = swapToMode(models.CHAT.GPT3);

const gpt4ominimode = swapToMode(models.CHAT.GPT4OMINI);

const gpt4turbomode = swapToMode(models.CHAT.GPT4TURBO);

const gpt4omode = swapToMode(models.CHAT.GPT4O);

const dallemode = swapToMode(models.IMAGE_GENERATION.DALLE3);

const gpto1mode = swapToMode(models.CHAT.O1);

const gpto1minimode = swapToMode(models.CHAT.O1MINI);

const getMode = async (ctx, usermode) => {
    await ctx.reply("your mode is currently: " + usermode.mode);
}

module.exports = {
    getMode,
    gpt3mode,
    gpt4ominimode,
    gpt4turbomode,
    gpt4omode,
    dallemode,
    gpto1mode,
    gpto1minimode,
}