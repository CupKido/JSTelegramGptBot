const { askGptWithHistory, gptMessage, gptImageMessage, models, roles} = require('nodegptwrapper');


const getGptMessageFactory = (gptMessage) => {
    if(Object.values(models.IMAGE_GENERATION).includes(gptMessage.modelType)){
        return gptImageMessage();
    }
}