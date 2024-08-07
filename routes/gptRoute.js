const {getMode, gptResponse, gptGenerateImage, gptRecognize, models} = require('../controllers/gptController');
const { message } = require('telegraf/filters')
const {LOADING_MESSAGES} = require('../config/const_messages');

const messagePending = [];

module.exports = (bot) => {
    bot.on(message('text'), addLoadingMessage(navigateGptMessage));
    bot.on('photo', addLoadingMessage(gptRecognize));
}

const navigateGptMessage = async (ctx) =>{
    const mode = await getMode(ctx);

    console.log(Object.values(models.IMAGE_GENERATION).includes(mode), Object.values(models.IMAGE_GENERATION), mode)
    if (mode && Object.values(models.IMAGE_GENERATION).includes(mode)) {
        await gptGenerateImage(ctx);
    }
    else {
        await gptResponse(ctx);
    }
}

const addLoadingMessage = (func) => {
    return async (ctx) => {
        try {
            userId = ctx.from.id;
            if(messagePending.includes(userId)){
                ctx.reply('waittttt! cant take more than 1 request at a time');

                return;
            }

            messagePending.push(userId);
            const loadingMessage = await ctx.reply(LOADING_MESSAGES[Math.floor(Math.random()*LOADING_MESSAGES.length)]);

            func(ctx)
            .then(() => {
                ctx.deleteMessage(loadingMessage.message_id);
                messagePending.splice(messagePending.indexOf(userId), 1);
            })
            .catch((error) => {
                console.log('error', error);
                ctx.deleteMessage(loadingMessage.message_id);
                ctx.reply('error');
            });   
        }catch(e){
            console.log('error', e);
            messagePending.splice(messagePending.indexOf(userId), 1);
        }
    }
}