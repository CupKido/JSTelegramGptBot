const { askGptWithHistory, gptImageRequest, generateImage, gptChatMessage, gptImageContent, gptMessageContent, models, roles} = require('nodegptwrapper');
const { splitMessageAndReply } = require('../utils');
// const { askGptWithHistory, gptRecognize } = require('../gpt/wrapper');
//console.log(models);
const UserMode = require('../models/userMode');

const getMode = async (ctx) => {
    return await UserMode.findOne({ _id: ctx.from.id }).then((result) => {
        if(!result){
            ctx.reply('please choose a mode first');
            return;
        }
        return result.mode;
    });
}

const gptResponse = async (ctx) =>{
    // console.log('sending', ctx.message.text);
    if(!ctx || !ctx.message || !ctx.message.text){
        return;
    }
    const message  =  ctx.message.text;
    
    if (!message || message.length > 20000){
        ctx.reply('message too long');
        return;
    }
    await UserMode.findOne({ _id: ctx.from.id }).then( async (result) => {
        if(!result){
            ctx.reply('please choose a mode first');
            return;
        }
        const history = result.history;
        
        const messages = history.map((message) => new gptChatMessage(message.role, new gptMessageContent(message.content[0].text)));
        messages.push(new gptChatMessage(roles.USER, new gptMessageContent(message)));
        
        await askGptWithHistory(result.mode, messages, process.env.OPENAI_API_KEY).then((response) => {    
            if(!response || response === message){
                ctx.reply('error');
                return;
            }
            
            splitMessageAndReply(response, 3000, ctx);

            result.history.push(new gptChatMessage(roles.USER, new gptMessageContent(message)).apiObj());
            result.history.push(new gptChatMessage(roles.GPT, new gptMessageContent(response)).apiObj());
            while(result.history.toString() > 20000 || result.history.length > 10){
                result.history.shift();
            }
            result.save().then((result) => {
                // //console.log('saved', result);
            });
        })
        .catch((error) => {
            ctx.reply('error');
            if(error.response.data){
                console.log(error.response.data);
            }else{
                console.log(error);
            }
        })

    });
}

const gptRecognize = async (ctx) => {
    if(!ctx) return;
    const photo = ctx.update.message?.photo;
    // Get the file ID of the first (largest) photo in the array
    const fileId = photo[photo.length - 1].file_id;
    await UserMode.findOne({ _id: ctx.from.id }).then(async (result) => {
            if(!result || !result.authorized){
                ctx.reply('sorry, you are not authorized for this mode!');
                return;
            }
            // Use the `getFile` method to get the file path
            await ctx.telegram.getFile(fileId).then(async (file) => {
            const photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`;
            let message = '';
            if(ctx && ctx.message && ctx.message.caption){
                message  =  ctx.message.caption;
            }
            if (message.length > 20000){
                ctx.reply('message too long');
                return;
            }
            if(!result){
                ctx.reply('please choose a mode first');
                return;
            }
            const messages = [new gptChatMessage(roles.USER, new gptImageContent(message, photoUrl))];
            await askGptWithHistory(models.IMAGE_RECOGNITION.GPT4VISION, messages, process.env.OPENAI_API_KEY).then((response) => {
                ctx.reply(response);
            }) 
            .catch((error) => {
                ctx.reply('error');
                if(error.response.data){
                    console.log(error.response.data);
                }else{
                    console.log(error);
                }
            })
        });
    });
}

const gptGenerateImage = async (ctx) => {
    if(!ctx || !ctx.message || !ctx.message.text){
        return;
    }
    const message  =  ctx.message.text;
    
    if (!message || message.length > 20000){
        ctx.reply('message too long');
        return;
    }
    await UserMode.findOne({ _id: ctx.from.id }).then(async (result) => {
        if(!result || !result.mode){
            ctx.reply('please choose a mode first');
            return;
        }
        await generateImage(result.mode, new gptImageRequest(message, 1, 1024), process.env.OPENAI_API_KEY).then(async (response) => {
            if(!response){
                ctx.reply('error');
                return;
            }
            for(const res of response){
                await ctx.replyWithPhoto(res["url"], {caption: res["revised_prompt"]});
            }
        });
    });
}

module.exports = {
    gptResponse,
    gptGenerateImage,
    gptRecognize,
    getMode,
    models
}