
const axios = require('axios');
const models = require('nodegptwrapper');
const roles = require('nodegptwrapper');
const gptApiUrl = "https://api.openai.com/v1/chat/completions"

const askGptWithHistory = async (model, history, apiKey) => {
    const body = {
        model,
        messages : history.map((message) => {return message.apiObj}),
        n: 1,
    }
    const headers = {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
    }
    return axios.post(gptApiUrl, body, {headers}).then((res) => {
        return res.data.choices[0].message.content;
    });
}

const gptRecognize = async (text, picUrl, apiKey) => {
    const body = {
        model : models.IMAGE_RECOGNITION,
        messages : [{role : "user", content : [{type : 'image_url', image_url: {"url": picUrl}}, {type : 'text', text: text}]}],
        max_tokens: 3000,
    }
    const headers = {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
    }
    return axios.post(gptApiUrl, body, {headers}).then((res) => {
        console.log(res)
        console.log(res.data)
        return res.data.choices[0].message.content;
    });
}

module.exports = {
    askGptWithHistory,
    gptRecognize,
    gptMessage,
    models,
    roles
}