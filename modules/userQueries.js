const ifUserAdmin = (usermode) => {
    return usermode.admin;
}

const ifUserUnlimited = (usermode) => {
    return usermode.unlimited;
}

const ifUserAuthorized = (usermode) => {
    return usermode.authorized;
}

const ifAny = (usermode) => {
    return true;
}

module.exports = {
    ifAny,
    ifUserAdmin,
    ifUserUnlimited,
    ifUserAuthorized
}