module.exports = {
    entry: {
        first: [
            "./js/src/init.js",
            "./js/src/alerter.js",
            "./js/src/map.js",
            "./js/src/markers.js",
            "./js/src/objects.js",
            "./js/src/socket.js",
            "./js/src/utils.js",
        ],
        last: [
            "./js/src/controls.js",
        ]
    },
    output: {
        filename: "[name]-bundle.js"
    }
};
