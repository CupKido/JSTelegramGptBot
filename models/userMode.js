const mongoose = require('mongoose');
const gptMessageSchema = require(__dirname + '/gptMessageSchema');
// const gptModels = require(__dirname + '/../SA/gptWrapper/gptModels');
const { models } = require('nodegptwrapper')
const userModeSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false
  },
  mode: {
    type: String,
    required: true,
    default: models.CHAT.GPT4OMINI
  },
  authorized : {
    type: Boolean,
    required: true,
    default: false
  },
  admin : {
    type: Boolean,
    required: true,
    default: false
  },
  history: [gptMessageSchema]
});

const UserMode = mongoose.model('UserMode', userModeSchema);

module.exports = UserMode;