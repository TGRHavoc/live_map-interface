import { Config } from "./config.js";
import { Markers } from "./markers.js";
import { MapWrapper } from "./map.js";
import { Alerter } from "./alerter.js";
// This file should initialize the map and set everything up for it to work.

class Initializer {

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
        console.log("Sending request to", url);
        const lang = window.Translator;
        let data = null;

        try {
            let response = await fetch(url);
            data = await response.json();

        } catch (error) {
            console.error("Getting blips: ", error);

            new Alerter({
                status: "error",
                title: lang.t("errors.getting-blips.title"),
                text: lang.t("errors.getting-blips.message", { error: error })
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

export { Initializer };
