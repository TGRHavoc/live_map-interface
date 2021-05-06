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
        Requester.sendRequestTo("config.json", function (request) {
            _.parseConfig(request);
            if (callback !== undefined) callback(true);
        }, function (request) {
            Alerter.createAlert({
                title: "Error getting config.json. Cannot load map",
                text: request.textStatus.statusText
            });
            if (callback !== undefined) callback(false)
        });
    }

    static parseConfig(request) {
        var str = JsonStrip.stripJsonOfComments(request.responseText);
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
