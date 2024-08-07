const mongoose = require('mongoose');

const urlschema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    }
});

const contentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: false,
    },
    image_url : {
        type: urlschema,
        required: false,
    },
    type: {
        type: String,
        required: true,
    },
});

const gptMessageSchema = new mongoose.Schema({
    content: [contentSchema],
    role: {
        type: String,
        required: true,
    },
    modelType : {
        type: String,
        required: false,
    },

});

module.exports = gptMessageSchema