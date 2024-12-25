const { gpt4turbomode, gpt4omode, dallemode, gpt3mode, gpto1mode, gpto1minimode, gpt4ominimode, getMode } = require('../controllers/gptModeController');
const { authUsers, unlimitUsers, listUsers, announce, tell, history, deAuthUsers, limitUsers, resetUsersMode } = require('../controllers/authController');
const { ifUserAuthorized, ifAny, ifUserUnlimited, ifUserAdmin } = require('../modules/userQueries');

function getIfDo(predicate, method, description) {
    return {
        "if" : predicate,
        "do" : method,
        "what" : description
    }
}

// const generalCommands = {
//     "help" : getIfDo(ifAny, help),
//     "start" : getIfDo(ifAny, start)
// }

const modeCommands = { 
    "o1" : { 
        "if" : ifUserUnlimited,
        "do" : gpto1mode,
        "what" : "sets the mode to gpt O1"
    },
    "gpt4o" : { 
        "if" : ifUserAuthorized,
        "do" : gpt4omode,
        "what" : "sets the mode to gpt 4O"
    },
    "dalle" : { 
        "if" : ifUserAuthorized,
        "do" : dallemode,
        "what" : "sets the mode to dalle3 (image generation)"
    },
    "gpt4" : { 
        "if" : ifUserAuthorized,
        "do" : gpt4turbomode,
        "what" : "sets the mode to gpt 4"
    },
    "o1mini" : { 
        "if" : ifUserAuthorized,
        "do" : gpto1minimode,
        "what" : "sets the mode to gpt O1 mini"
    },
    "gpt4omini" : { 
        "if" : ifAny,
        "do" : gpt4ominimode,
        "what" : "sets the mode to gpt 4O mini"
    },
    "gpt3" : { 
        "if" : ifAny,
        "do" : gpt3mode,
        "what" : "sets the mode to gpt 3"
    },
    "myMode" : getIfDo(ifAny, getMode, "tells you what mode are you on")
}

const managmentCommands = {
    "tell" : getIfDo(ifUserAdmin, tell, "send message to user by id"),
    "announce" : getIfDo(ifUserAdmin, announce, "send message to all users"),
    "auth" : getIfDo(ifUserAdmin, authUsers, "authorizes a user to use the bot\'s pricey features"),
    "deauth" : getIfDo(ifUserAdmin, deAuthUsers, "removes authorization from user"),
    "unlimit" : getIfDo(ifUserAdmin, unlimitUsers, "authorizes a user to use the bot\'s extra pricey features"),
    "limit" : getIfDo(ifUserAdmin, limitUsers, "removes unlimited mode from user"),
    "history" : getIfDo(ifUserAdmin, history, "shows the chat history of a user"),
    "listUsers" : getIfDo(ifUserAdmin, listUsers, "lists all users"),
    "resetMode" : getIfDo(ifUserAdmin, resetUsersMode, "reset users mode by id"),
}

module.exports = {
    modeCommands,
    managmentCommands,
}