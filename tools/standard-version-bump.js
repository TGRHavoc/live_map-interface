
module.exports.readVersion = function (contents) {
    return JSON.parse(contents).interface;
}

module.exports.writeVersion = function (contents, version) {
    const json = JSON.parse(contents);
    json.interface = version
    return JSON.stringify(json, null, 4)
}
