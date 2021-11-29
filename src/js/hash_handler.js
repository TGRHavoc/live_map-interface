import { initConsole as initalizeConsole } from "./init";
import { config } from "./config";

import { changeServer } from "./map";

const HANDLERS = {
    // Debug enabled
    debug: {
        clean: (allValues) => {
            if (allValues.length === 0) {
                return false;
            }
            return allValues[0] === "true" || allValues[0] === "1"; // Convert to a boolean value
        },
        handle: (value) => initalizeConsole(value),
    },
    // Selected server
    server: {
        clean: (allValues) =>
            allValues[0].length !== 0
                ? decodeURI(allValues[0])
                : Object.keys(config.servers)[0],
        handle: (serverName) => changeServer(serverName),
    },
};

export const init = () => {
    let hashString = window.location.hash;
    hashString = hashString.replaceAll("#", "").replaceAll("?", ""); // Get rid of the hash and any question marks we may have

    const urlSearch = new URLSearchParams(hashString);
    runHandlers(urlSearch);
};

const runHandlers = (urlSearch) => {
    const seenKeys = [];

    for (const key of urlSearch.keys()) {
        if (seenKeys.includes(key)) continue;

        if (HANDLERS[key]) {
            HANDLERS[key].handle(HANDLERS[key].clean(urlSearch.getAll(key)));
        }
        seenKeys.push(key);
    }
};
