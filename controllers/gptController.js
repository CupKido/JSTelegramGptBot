const { askGptWithHistory, gptMessage, gptImageMessage, models, roles} = require('nodegptwrapper');
// const { askGptWithHistory, gptRecognize } = require('../gpt/wrapper');
const UserMode = require('../models/userMode');

const gptResponse = (ctx) =>{
    // console.log('sending', ctx.message.text);
    const message  =  ctx.message.text;
    if (message.length > 20000){
        ctx.reply('message too long');
        return;
    }
    UserMode.findOne({ _id: ctx.from.id }).then((result) => {
        if(!result){
            ctx.reply('please choose a mode first');
            return;
        }
        const history = result.history;
        // console.log('history', history);
        const messages = history.map((message) => new gptMessage(message.content[0].text, message.role));
        messages.push(new gptMessage(message, roles.USER));
        // console.log('messages', messages);
        askGptWithHistory(result.mode, messages, process.env.OPENAI_API_KEY).then((response) => {
            // console.log('response', response);
            ctx.reply(response);

            result.history.push(new gptMessage(message, roles.USER).apiObj);
            result.history.push(new gptMessage(message, roles.GPT).apiObj);
            while(result.history.toString() > 20000 || result.history.length > 10){
                result.history.shift();
            }
            result.save().then((result) => {
                // //console.log('saved', result);
            });
        }).catch((error) => {
            console.log(error);
            ctx.reply('error');
        })

    });
}

const gptRecognize = (ctx) => {
    if(!ctx) return;
    const photo = ctx.update.message?.photo;
    // Get the file ID of the first (largest) photo in the array
    const fileId = photo[photo.length - 1].file_id;
    UserMode.findOne({ _id: ctx.from.id }).then((result) => {
            if(!result || !result.authorized){
                ctx.reply('sorry, you are not authorized for this mode!');
                return;
            }
            // Use the `getFile` method to get the file path
            ctx.telegram.getFile(fileId).then((file) => {
            const photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`;
            const message  =  ctx.message.caption;
            if (message.length > 20000){
                ctx.reply('message too long');
                return;
            }
            if(!result){
                ctx.reply('please choose a mode first');
                return;
            }
            const history = result.history;
            // console.log('history', history);
            const messages = history.map((message) =>{
                    return new gptMessage(message.content[0].text, message.role);
            });
            // console.log('picobj', JSON.stringify(new gptImageMessage(message, roles.USER, photoUrl).apiObj));
            messages.push(new gptImageMessage(message, roles.USER, photoUrl));
            askGptWithHistory(models.GPT4VISION, messages, process.env.OPENAI_API_KEY).then((response) => {
                // console.log('response', response);
                ctx.reply(response);
                
                result.history.push(new gptMessage(message, roles.USER).apiObj);
                result.history.push(new gptMessage(response, roles.GPT).apiObj);
                while(result.history.toString() > 20000 || result.history.length > 10){
                    result.history.shift();
                }
                result.save().then((result) => {
                    console.log('saved', result);
                });
            }) .catch((error) => {
                console.log(error.response.data);
                ctx.reply('error');
            })
        });
    });
}


module.exports = {
    gptResponse,
    gptRecognize
}