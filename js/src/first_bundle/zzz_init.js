/// <reference path="./config.js" />
/// <reference path="./map.js" />
/// <reference path="./markers.js" />
/// <reference path="./1_utils.js" />
// This file should initialize the map and set everything up for it to work.

class Initializer {

    static page(config){

        // window.addEventListener('resize', function(event) {
        //     document.getElementsByClassName("map-tab-content");
        // }, true);
        // $(window).on("load resize", function() {
        //     $(".map-tab-content").height((($("#tab-content").height() - $(".page-title-1").height()) - ($("#map-overlay-global-controls").height() * 4.2)));
        // });

        let serverMenu = document.getElementById("server_menu");
        for (const serverName in config.servers) {
            let li = document.createElement("li");
            let link = document.createElement("a");
            link.classList.add("dropdown-item", "serverMenuItem");
            link.href = "#";
            link.innerText = serverName;

            li.appendChild(link);
            serverMenu.appendChild(li);
            //$("#server_menu").append("<a class='dropdown-item serverMenuItem' href='#'>" + serverName + "</a>");
        }

        // var $myGroup = document.getElementById('control-wrapper');
        // $myGroup.addEventListener("show.bs.collapse", function() {
        //     console.log("HELP");
        //     console.log(this);
        // }, true);
        // $myGroup.on('show.bs.collapse','.collapse', function() {
        //     console._log("hidding?");
        //     $myGroup.find('.collapse.show').collapse('hide');
        // });
    }

    static blips(url, markers){
        Config.log("Sending request to ", url);
        Requester.sendRequestTo(url, function(req) {
            Initializer.gotBlipSuccess(req, markers);
        }, Initializer.gotBlipFailed);
    }

    static gotBlipSuccess(request, markers){
        let data = "";
        try{
            data = JSON.parse(request.responseText);
        }catch(e){
            console.error(e);
            Alerter.createAlert({
                status: "error",
                title: "Error parsing blips!",
                text: e
            });
            return;
        }

        for (var spriteId in data) {
            if (data.hasOwnProperty(spriteId)) {
                // data[spriteId] == array of blips for that type
                var blipArray = data[spriteId];

                for (var i in blipArray) {
                    var blip = blipArray[i];
                    var fallbackName = (markers.MarkerTypes[spriteId] != undefined && markers.MarkerTypes[spriteId].hasOwnProperty("name")) ? markers.MarkerTypes[spriteId].name : "Unknown Name... Please make sure the sprite exists.";

                    blip.name = (blip.hasOwnProperty("name") || blip.name != null) ? blip.name : fallbackName;
                    blip.description = (blip.hasOwnProperty("description") || blip.description != null) ? blip.description : "";

                    blip.type = spriteId;
                    //TODO: Implement
                    //createBlip(blip);
                }
            }
        }

        //TODO: Implement
        // Config.log(_blipCount + " blips created");
        // document.getElementById("blip_count").innerText = _blipCount;
        //$("#blip_count").text(_blipCount);
        //toggleBlips();
    }

    static gotBlipFailed(request){
        console.error("Error \"" + JSON.stringify(request.textStatus));

        Alerter.createAlert({
            status: "error",
            title: "Error getting blips!",
            text: request.textStatus.statusText
        });
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    window.Translator = new Translator();

    Config.getConfigFileFromRemote(function(success){

        if (!success){ // We can't do anything
            console.error("Cannot load map as we can't load config.json");
            return;
        }

        const config = Config.getConfig();
        for (const serverName in config.servers) {
            // Make sure all servers inherit defaults if they need
            var o = Object.assign({}, config.defaults, config.servers[serverName]);
            Config.staticConfig.servers[serverName] = o;
        }

        const markers = window.markers = new Markers(config); // initMarkers

        const socketHandler = window.socketHandler = new SocketHandler();
        const mapWrapper = window.mapWrapper = new MapWrapper(socketHandler); // mapInit

        // todo: Initialize controls/page
        Initializer.page(config);

        mapWrapper.changeServer(Object.keys(Config.staticConfig.servers)[0]); // Show the stuff for the first server in the config.
    });
});
