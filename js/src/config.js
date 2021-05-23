import {JsonStrip} from "./utils.js";
import {Alerter} from "./alerter.js";

export class Config {
    constructor() { }

    static getConfig() {
        if (JSON.stringify(this.staticConfig) === "{}") {
            this.getConfigFileFromRemote();
            console.warn("config didn't exist... try getting it again");
        }

        return this.staticConfig;
    }

    // TODO: Move into own class? Config doesn't seem like a good fit here.
    static log(message, ...params){
        if(Config.staticConfig.debug){
            params.unshift(message);
            console.log.apply(this, params);
        }
    }

    static async getConfigFileFromRemote() {
        const lang = window.Translator;

        try{
            let config = await fetch("config.json");

            let configData = await config.text();
            Config.log("Parsing: ", configData);

            let str = JsonStrip.stripJsonOfComments(configData);
            let configParsed = JSON.parse(str);
            Config.staticConfig = Object.assign(Config.defaultConfig, configParsed);

            return Promise.resolve(configParsed);

        }catch(ex){
            console.error(ex);
            new Alerter({
                status: "error",
                title: lang.t("errors.getting-config.title"),
                text: lang.t("errors.getting-config.message", {error: ex})
            });
            return Promise.reject(ex);
        }
    }
}

Config.defaultConfig = {
    debug: false,
    tileDirectory: "images/tiles",
    iconDirectory: "images/icons",
    showIdentifiers: false,
    groupPlayers: true,
    defaults: {
        ip: "127.0.0.1",
        socketPort: "30121"
    },
    servers: []
};
Config.staticConfig = {};
