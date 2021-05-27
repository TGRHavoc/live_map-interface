import { Config } from "./config.js";
import { Translator } from "./translator.js";
import { Markers } from "./markers.js";
import { SocketHandler } from "./socket.js";
import { MapWrapper } from "./map.js";
import { Alerter } from "./alerter.js";
import { VersionCheck } from "./version-check.js";
import { Controls } from "./controls.js";

// This file should initialize the map and set everything up for it to work.

export class Initializer {

    static page(config) {
        let serverMenu = document.getElementById("serverMenu");
        for (const serverName in config.servers) {
            let li = document.createElement("li");
            let link = document.createElement("a");
            link.classList.add("dropdown-item");
            link.href = "#";
            link.innerText = serverName;

            li.appendChild(link);
            serverMenu.appendChild(li);
            //$("#serverMenu").append("<a class='dropdown-item serverMenuItem' href='#'>" + serverName + "</a>");
        }
    }

    /**
     * 
     * @param {String} url 
     * @param {Markers} markers 
     * @param {MapWrapper} mapWrapper 
     */
    static async blips(url, markers, mapWrapper) {
        Config.log("Sending request to", url);
        const lang = window.Translator;
        let data = null;

        try {
            let response = await fetch(url);
            data = await response.json();

        } catch (error) {
            console.error("Getting blips: ", error);

            new Alerter({
                status: "error",
                title: lang.t("errors.getting-config.title"),
                text: lang.t("errors.getting-config.message", { error: error })
            });
            return false;
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

                    mapWrapper.createBlip(blip, markers.MarkerTypes);

                }
            }
        }

        document.getElementById("blipCount").innerText = mapWrapper.blipCount;
        mapWrapper.toggleBlips();

    }
}

// Modules should be deferred so, DOM should be loaded already when we get here..

(async () => {
    let translator = window.Translator = new Translator();

    let config = undefined;

    try {
        await translator.getLanguageFromFile();

        config = await Config.getConfigFileFromRemote();

    } catch (ex) {
        console.error("Couldn't load LiveMap")
        console.error(ex);
        return;
    }

    window.VersionCheck = new VersionCheck();

    for (const serverName in config.servers) {
        // Make sure all servers inherit defaults if they need
        let o = Object.assign({}, config.defaults, config.servers[serverName]);
        Config.staticConfig.servers[serverName] = o;
    }


    const socketHandler = window.socketHandler = new SocketHandler();
    const mapWrapper = window.mapWrapper = new MapWrapper(socketHandler);

    const controls = window.controls = new Controls(mapWrapper); // This calls initControls internally
    const markers = window.markers = new Markers(config, controls);

    Initializer.page(config);
    mapWrapper.changeServer(Object.keys(Config.staticConfig.servers)[0]); // Show the stuff for the first server in the config.
})();

// document.addEventListener('DOMContentLoaded', () => {
//     window.Translator = new Translator();

//     window.Translator.getLanguageFromFile(() => {

//         Config.getConfigFileFromRemote(function(success){

//             if (!success){ // We can't do anything
//                 console.error("Cannot load map as we can't load config.json");
//                 return;
//             }

//             const config = Config.getConfig();
//             for (const serverName in config.servers) {
//                 // Make sure all servers inherit defaults if they need
//                 var o = Object.assign({}, config.defaults, config.servers[serverName]);
//                 Config.staticConfig.servers[serverName] = o;
//             }

//             const markers = window.markers = new Markers(config); // initMarkers

//             const socketHandler = window.socketHandler = new SocketHandler();
//             const mapWrapper = window.mapWrapper = new MapWrapper(socketHandler); // mapInit

//             // todo: Initialize controls/page
//             Initializer.page(config);

//             mapWrapper.changeServer(Object.keys(Config.staticConfig.servers)[0]); // Show the stuff for the first server in the config.
//         });
//     });
// });
