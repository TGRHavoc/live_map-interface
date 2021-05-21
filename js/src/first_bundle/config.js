class Config {
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

    static getConfigFileFromRemote(callback) {
        const _ = this;
        const lang = window.Translator;

        fetch("config.json").then(async response => {
            if (!response.ok){
                throw Error(lang.t("errors.response-not-ok", {statusText: response.statusText}));
            }

            let j = await response.text();
            Config.parseConfig(j);

            if (callback !== undefined) callback(true);
        }).catch(err => {
            Alerter.createAlert({
                status: "error",
                title: lang.t("errors.getting-config"),
                text: `${err.message}`
            });

            if (callback !== undefined) callback(false);
        });
    }

    static parseConfig(json) {
        var str = JsonStrip.stripJsonOfComments(json);
        var configParsed = JSON.parse(str);
        Config.staticConfig = Object.assign(Config.defaultConfig, configParsed);
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
