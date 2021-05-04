

class Config {
    constructor(){
        this.defaultConfig = {
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

        this.getConfigFile();
    }

    getConfigFile(){
        Requester.sendRequestTo("config.json", this.parseConfig(this), function(request){
            Alerter.createAlert({
                title: "Error getting config.json. Cannot load map",
                text: request.textStatus.statusText
            });
        });
    }
    
    parseConfig(_){
        return function(request){
            var str = JsonStrip.stripJsonOfComments(request.responseText);
            var configParsed = JSON.parse(str);
            _.config = Object.assign(_.defaultConfig, configParsed);
        }
    }

}
