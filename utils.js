const { maxMessageLength } = require("./config/constants");

function splitStringByLength(inputString, maxLength) {
    const stringArray = [];

    for (let i = 0; i < inputString.length; i += maxLength) {
        stringArray.push(inputString.substring(i, i + maxLength));
    }

    return stringArray;
}

const splitMessageAndReply = async (messageToSplit, delay, context) => {
    if(!context.reply) {
        return;
    }
    
    const messageParts = splitStringByLength(messageToSplit, maxMessageLength)
    messageParts.forEach((messagePart, index) => {
        setTimeout(() => context.reply(messagePart), index * delay);
    });
}

module.exports = {
    splitMessageAndReply
};