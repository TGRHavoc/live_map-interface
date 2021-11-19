import { Initializer } from "./init.js";
import { Config } from "./config.js";

class HashHandler {

    HANDLERS = {
        // Debug enabled
        "debug": {
            clean: (allValues) => {
                if(allValues.length === 0){
                    return false;
                }
                return allValues[0] === "true" || allValues[0] === "1"; // Convert to a boolean value
            },
            handle: (value) => Initializer.console(value)
        },
        // Selected server
        "server": {
            clean: (allValues) => allValues[0].length !== 0 ? decodeURI(allValues[0]) : Object.keys(Config.staticConfig.servers)[0],
            handle: (serverName) => window.mapWrapper.changeServer(serverName)
        }
    };

    constructor() {
        let hashString = window.location.hash;
        hashString = hashString.replaceAll("#", "").replaceAll("?", ""); // Get rid of the hash and any question marks we may have

        const urlSearch = new URLSearchParams(hashString);
        this.runHandlers(urlSearch);
    }

    runHandlers(urlSearch){
        const seenKeys = [];

        for(const key of urlSearch.keys()){
            if (seenKeys.includes(key)) continue;

            if(this.HANDLERS[key]){
                this.HANDLERS[key].handle(this.HANDLERS[key].clean(urlSearch.getAll(key)));
            }
            seenKeys.push(key);
        }
    }

}

export {HashHandler};
