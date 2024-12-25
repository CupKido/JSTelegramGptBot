const { gpt4turbomode, gpt4omode, dallemode, gpt3mode, gpto1mode, gpto1minimode, gpt4ominimode } = require('../controllers/gptModeController');
const { authUsers, unlimitUsers, listUsers, announce, tell, history, deAuthUsers, limitUsers } = require('../controllers/authController');
const { ifUserAuthorized, ifAny, ifUserUnlimited, ifUserAdmin } = require('../modules/userQueries');

function getIfDo(predicate, method) {
    return {
        "if" : predicate,
        "do" : method
    }
}

// const generalCommands = {
//     "help" : getIfDo(ifAny, help),
//     "start" : getIfDo(ifAny, start)
// }

const modeCommands = { 
    "o1" : { 
        "if" : ifUserUnlimited,
        "do" : gpto1mode 
    },
    "gpt4o" : { 
        "if" : ifUserAuthorized,
        "do" : gpt4omode 
    },
    "dalle" : { 
        "if" : ifUserAuthorized,
        "do" : dallemode 
    },
    "gpt4" : { 
        "if" : ifUserAuthorized,
        "do" : gpt4turbomode 
    },
    "o1mini" : { 
        "if" : ifUserAuthorized,
        "do" : gpto1minimode 
    },
    "gpt4omini" : { 
        "if" : ifAny,
        "do" : gpt4ominimode 
    },
    "gpt3" : { 
        "if" : ifAny,
        "do" : gpt3mode 
    },
}

const managmentCommands = {
    "tell" : getIfDo(ifUserAdmin, tell),
    "announce" : getIfDo(ifUserAdmin, announce),
    "auth" : getIfDo(ifUserAdmin, authUsers),
    "deauth" : getIfDo(ifUserAdmin, deAuthUsers),
    "unlimit" : getIfDo(ifUserAdmin, unlimitUsers),
    "limit" : getIfDo(ifUserAdmin, limitUsers),
    "history" : getIfDo(ifUserAdmin, history),
    "listUsers" : getIfDo(ifUserAdmin, listUsers)
}

module.exports = {
    modeCommands,
    managmentCommands,
}