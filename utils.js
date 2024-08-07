function splitStringByLength(inputString, maxLength) {
    const stringArray = [];

    for (let i = 0; i < inputString.length; i += maxLength) {
        stringArray.push(inputString.substring(i, i + maxLength));
    }

    return stringArray;
}

module.exports = {
    splitStringByLength
};