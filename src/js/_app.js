import "../sass/main.scss";

import { Config } from "./config";
import { Translator } from "./translator";
import { SocketHandler } from "./socket";
import { MapWrapper } from "./map";
import { VersionCheck } from "./version-check";
import { Initializer } from "./init";
import {Alerter} from "./alerter";

async function init() {

    window.Alerter = Alerter;
    window.Config = Config;

    let translator = window.Translator = new Translator();

    let config = null;

    try {
        await translator.getLanguageFromFile();

        config = await Config.getConfigFileFromRemote();

    } catch (ex) {
        console.error("Couldn't load LiveMap");
        console.error(ex);
    }

    Initializer.console(config.debug);

    window.VersionCheck = new VersionCheck();

    for (const serverName in config.servers) {
        // Make sure all servers inherit defaults if they need
        let o = Object.assign({}, config.defaults, config.servers[serverName]);
        Config.staticConfig.servers[serverName] = o;
    }


    const socketHandler = window.socketHandler = new SocketHandler();
    const mapWrapper = window.mapWrapper = new MapWrapper(socketHandler);

    Initializer.page(config);
    mapWrapper.changeServer(Object.keys(Config.staticConfig.servers)[0]); // Show the stuff for the first server in the config.

    // Do any query string stuff here...
    Initializer.hashHandler();


    window.onhashchange = () => {
        Initializer.hashHandler();
    };

}

init();
