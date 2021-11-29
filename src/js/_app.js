import "../sass/main.scss";

import * as Config from "./config";
import * as Translator from "./translator";
import * as MapWrapper from "./map";
import { SocketHandler } from "./socket";
import * as Initializer from "./init";

async function init() {
    let config = null;

    try {
        await Translator.init();
        await Translator.getLanguageFromFile();

        config = await Config.getConfigFileFromRemote();
    } catch (ex) {
        console.error("Couldn't load LiveMap");
        console.error(ex);
    }

    Initializer.initConsole(config.debug);

    // window.VersionCheck = new VersionCheck();

    for (const serverName in config.servers) {
        // Make sure all servers inherit defaults if they need
        let o = Object.assign({}, config.defaults, config.servers[serverName]);

        config.servers[serverName] = o;
        // Config.addServer(serverName, o);
    }

    const socketHandler = new SocketHandler();
    // const mapWrapper = new MapWrapper(socketHandler);
    MapWrapper.init(socketHandler);

    Initializer.page(config);
    MapWrapper.changeServer(Object.keys(config.servers)[0]); // Show the stuff for the first server in the config.

    // Do any query string stuff here...
    Initializer.hashHandler();

    window.onhashchange = () => {
        Initializer.hashHandler();
    };
}

init();
