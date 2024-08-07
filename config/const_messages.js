const HELP_MESSAGE = 'Hello! this is a bot that lets you use ChatGPT\'s API on telegram\n\n' +
'Commands:\n' +
'/gpt3 - sets the mode to gpt3.5\n' +
'/gpt4 - sets the mode to gpt4 turbo\n' +
'/gpt4o - sets the mode to gpt4O\n' +
'/dalle - sets the mode to dalle3 (image generation)\n' +
'/help - shows this message\n' +
'/myID - shows your telegram id\n' +
'Also, the bot supports GPT\'s vision API, so send it a picture and see what he sees!\n' +
'if you have suggestions or issues, please contact the admin.\n' +
'\n' +
"NOTE that only users that have been authorized by the admin can use GPT4, so if you\'re interested, contact the admin! ( https://t.me/saarta37 )";

const LOADING_MESSAGES = ["Just a moment, I'm working on it.",
"Hang tight, I'm fetching the information.",
"Loading, please wait patiently.",
"I'll be right with you, just a few more seconds.",
"Hold on, we're almost there!",
"Just a little more time, almost done.",
"Please be patient, I'm processing your request.",
"I'm on it, sit back and relax.",
"Taking a moment to gather the data.",
"Almost ready, thank you for your patience."]


module.exports = {
    HELP_MESSAGE,
    LOADING_MESSAGES,
}