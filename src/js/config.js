import { JsonStrip } from "./utils";
import { Alerter } from "./alerter";

import { t } from "./translator";

const defaultConfig = {
    debug: false,
    tileDirectory: "images/tiles",
    iconDirectory: "images/icons",
    showIdentifiers: false,
    groupPlayers: true,
    defaults: {
        ip: "127.0.0.1",
        socketPort: "30121",
    },
    servers: [],
};

export let config = {};

export const getConfig = async () => {
    if (JSON.stringify(config) === "{}") {
        await getConfigFileFromRemote();
        console.warn("config didn't exist... try getting it again");
    }

    return config;
};

export const getConfigFileFromRemote = async () => {
    try {
        let resp = await fetch("config.json");

        let configData = await resp.text();
        // console.log("Parsing: ", configData);

        let str = JsonStrip.stripJsonOfComments(configData);
        let configParsed = JSON.parse(str);
        config = Object.assign({}, defaultConfig, configParsed);

        return Promise.resolve(configParsed);
    } catch (ex) {
        console.error(ex);
        new Alerter({
            status: "error",
            title: t("errors.getting-config.title"),
            text: t("errors.getting-config.message", {
                error: ex,
            }),
        });
        return Promise.reject(ex);
    }
};

export const addServer = (serverName, conf) => (config[serverName] = conf);

export default config;
