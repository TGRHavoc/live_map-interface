import Notify from "simple-notify";

import t from "./translator";

import { init as HashHandlerInit } from "./hash_handler";
import { initMarkers, MarkerTypes } from "./markers";

import * as MapWrapper from "./map";

// This file should initialize the map and set everything up for it to work.

export const page = (config) => {
    // Server select
    let serverMenu = document.getElementById("serverMenu");
    for (const serverName in config.servers) {
        let li = document.createElement("li");
        let link = document.createElement("a");
        link.classList.add("dropdown-item");
        // link.onclick = (e)=> e.preventDefault();
        link.innerText = serverName;

        li.appendChild(link);
        serverMenu.appendChild(li);
        //$("#serverMenu").append("<a class='dropdown-item serverMenuItem' href='#'>" + serverName + "</a>");
    }

    // Blip stuff
    initMarkers();
};

let oldConsoleLog = null;

export const initConsole = (debug) => {
    console.log("Init console", debug);

    if (!debug) {
        console.log("Disabling console.log... Goodbye console!");
        oldConsoleLog = console.log;
        console.log = function () {}; // If we don't have debugging enabled. Just route all console.log's to an empty function
    } else {
        if (oldConsoleLog) {
            console.log = oldConsoleLog;
        }
    }
};

/**
 *
 * @param {String} url
 */
export const blips = async (url) => {
    console.log("Sending request to", url);
    let data = null;

    try {
        let response = await fetch(url);
        data = await response.json();
    } catch (error) {
        console.error("Getting blips: ", error);

        new Notify({
            status: "error",
            title: t("errors.getting-blips.title"),
            text: t("errors.getting-blips.message", { error: error }),
        });
        return false;
    }

    for (var spriteId in data) {
        const hasOwnProperty = Object.prototype.hasOwnProperty;
        if (hasOwnProperty.call(data, spriteId)) {
            // data[spriteId] == array of blips for that type
            var blipArray = data[spriteId];

            for (var i in blipArray) {
                var blip = blipArray[i];
                var fallbackName =
                    MarkerTypes[spriteId] !== undefined &&
                    hasOwnProperty.call(MarkerTypes[spriteId], "name")
                        ? MarkerTypes[spriteId].name
                        : "Unknown Name... Please make sure the sprite exists.";

                blip.name =
                    hasOwnProperty.call(blip, "name") || blip.name !== null
                        ? blip.name
                        : fallbackName;
                blip.description =
                    hasOwnProperty.call(blip, "description") ||
                    blip.description !== null
                        ? blip.description
                        : "";

                blip.type = spriteId;

                MapWrapper.createBlip(blip, MarkerTypes);
            }
        }
    }

    document.getElementById("blipCount").innerText = MapWrapper.blipCount;
    MapWrapper.toggleBlips();
};

export const hashHandler = () => {
    HashHandlerInit();
};
