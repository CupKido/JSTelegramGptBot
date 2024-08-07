const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');
dotenv.config();

process.env.OPENAI_API_KEY;

const url = "https://api.openai.com/v1/images/edits"

const headers = {
    "Authorization": "Bearer " + process.env.OPENAI_API_KEY
}

const body = {
    "image" : fs.createReadStream("img.png"),
    "prompt" : "A beautiful sunset over the city",
    "model" : "dall-e-2",
    "n" : 4,
}

// make multipart/form-data body

const form = new FormData();
form.append('image', fs.createReadStream("img.PNG"));
form.append('prompt', 'A beautiful sunset over the city');
form.append('model', 'dall-e-2');
form.append('n', 4);

axios.post(url, form, {headers: headers}).then((response) => {
    console.log(response.data);
}).catch((error) => {
    console.error(error.response.data);
});
