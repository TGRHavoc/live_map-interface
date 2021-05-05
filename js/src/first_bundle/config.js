class Config {
    constructor() { }
    static getConfig() {
        console.log(this.staticConfig);
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

    static getConfigFileFromRemote() {
        Requester.sendRequestTo("config.json", this.parseConfig, function (request) {
            Alerter.createAlert({
                title: "Error getting config.json. Cannot load map",
                text: request.textStatus.statusText
            });
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
