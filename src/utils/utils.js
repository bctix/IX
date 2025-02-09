
const consoleColors = {
    "SUCCESS": "\u001b[32m",
    "WARNING": "\u001b[33m",
    "ERROR": "\u001b[31m"
};

function log(type, path, text) {
    console.log(`\u001b[36;1m<ix>\u001b[0m\u001b[34m [${path}]\u001b[0m - ${consoleColors[type]}${text}\u001b[0m`);
}

function parseBool(string) {
    return string == "true"
}

module.exports = { log, parseBool }