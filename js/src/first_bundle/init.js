/// <reference path="./config.js" />
/// <reference path="./map.js" />
/// <reference path="./markers.js" />
/// <reference path="./utils.js" />
// This file should initialize the map and set everything up for it to work.

(function() {

    Config.getConfigFileFromRemote(function(success){

        if (!success){ // We can't do anything
            console.error("Cannot load map as we can't load config.json");
            return;
        }

        const config = Config.getConfig();
        for (const serverName in config.servers) {
            // Make sure all servers inherit defaults if they need
            var o = Object.assign({}, config.defaults, config.servers[serverName]);
            Config.staticConfig.servers[serverName] = o;
        }

        // Make sure we can get our config file
        const socketHandler = window.socketHandler = new SocketHandler();
        const mapWrapper = window.mapWrapper = new MapWrapper(socketHandler);

        mapWrapper.changeServer(Object.keys(Config.staticConfig.servers)[0]); // Show the stuff for the first server in the config.
    });

})()
