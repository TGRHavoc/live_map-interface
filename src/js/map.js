/// <reference path="./socket.js" />

import { config } from "./config";

import { Alerter } from "./alerter";
import { MarkerObject, Coordinates } from "./objects";

import { playerMarker_onClick } from "./controls";

import { Utils } from "./utils";

import { MarkerTypes } from "./markers";

import t from "./translator";
import * as Initializer from "./init";

import * as L from "leaflet";
import "leaflet.markercluster";

L.Control.CustomLayer = L.Control.Layers.extend({
    _checkDisabledLayers: function () {},
});

export let MarkerStore = [];
export let PopupStore = {}; // { MarkerId: Popup }
export let CurrentLayer = undefined;
export let PlayerMarkers = L.markerClusterGroup({
    maxClusterRadius: 20,
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
});
export let socketHandler = null;
/** @type {L.Map} */
export let Map = undefined;
export let connectedTo = {};

export let Filter = undefined; // For filtering players
export let CanFilterOn = []; // What can the user filter?

export let blips = [];
export let showBlips = true;
export let disabledBlips = [];
export let blipCount = 0;

export let localPlayerCache = {};

export let trackPlayer = null;

// this.mapInit("mapCanvas");

/**
 * Creates an instance of MapWrapper.
 * @param {SocketHandler} _socketHandler
 */
export const init = (_socketHandler) => {
    socketHandler = _socketHandler;
    mapInit("mapCanvas");
};

export const createBlip = (blip) => {
    if (!Object.prototype.hasOwnProperty.call(blip, "pos")) {
        // BACKWARDS COMPATABILITY!!
        blip.pos = { x: blip.x, y: blip.y, z: blip.z };

        //Delete the old shit.. It's nicly wrapped in the pos object now
        delete blip.x;
        delete blip.y;
        delete blip.z;
    }

    var obj = new MarkerObject(
        blip.name,
        new Coordinates(blip.pos.x, blip.pos.y, blip.pos.z),
        MarkerTypes[blip.type],
        blip.description,
        "",
        ""
    );

    if (!blips[blip.type]) {
        blips[blip.type] = [];
    }

    blip.markerId = createMarker(false, obj, "") - 1;

    blips[blip.type].push(blip);
    blipCount++;
};

export const toggleBlips = () => {
    for (var spriteId in blips) {
        var blipArray = blips[spriteId];
        console.log(
            "Disabled (" + spriteId + ")? " + disabledBlips.includes(spriteId)
        );

        if (disabledBlips.indexOf(spriteId) !== -1) {
            //console.log("Blip " + spriteId + "'s are disabled..");

            blipArray.forEach((blip) => {
                //console.log(blip);
                var marker = MarkerStore[blip.markerId];
                marker.remove();
            });

            // If disabled, don't make a marker for it
            continue;
        }

        blipArray.forEach((blip) => {
            //console.log(blip);
            var marker = MarkerStore[blip.markerId];
            if (showBlips) {
                marker.addTo(Map);
            } else {
                marker.remove();
            }
        });
    }
};

export const changeServer = (nameOfServer) => {
    if (!(nameOfServer in config.servers)) {
        new Alerter({
            title: t("errors.server-config.title"),
            text: t("errors.server-config.message", {
                nameOfServer,
            }),
        });
        return;
    }

    connectedTo = config.servers[nameOfServer];
    // clearAllMarkers(); // Make sure _all_ markers from previous server has been removed.

    connectedTo.getBlipUrl = function () {
        // this = the "connectedTo" server
        if (this.reverseProxy && this.reverseProxy.blips) {
            return this.reverseProxy.blips;
        }
        return `http://${this.ip}:${this.socketPort}/blips.json`;
    };

    connectedTo.getSocketUrl = function () {
        // this = the "connectedTo" server
        if (this.reverseProxy && this.reverseProxy.socket) {
            return this.reverseProxy.socket;
        }
        return `ws://${this.ip}:${this.socketPort}`;
    };

    // If we've changed servers. Might as well reset everything.
    if (
        socketHandler.webSocket &&
        socketHandler.webSocket.readyState === WebSocket.OPEN
    ) {
        socketHandler.webSocket.close();
    }
    // $("#serverName").text(nameOfServer);

    document.getElementById("serverName").innerText = nameOfServer;

    // // Reset controls.
    // $("#playerSelect").children().remove();
    // $("#playerSelect").append("<option></option>");

    // $("#filterOn").children().remove();
    // $("#filterOn").append("<option></option>");
    // $("#onlyShow").text("");
    Filter = undefined;

    setTimeout(function () {
        Initializer.blips(connectedTo.getBlipUrl());

        socketHandler.connect(connectedTo.getSocketUrl());
    }, 50);
};

export const mapInit = (elementID) => {
    // Create the different layers
    let tileLayers = {};
    let maps = config.maps;
    maps.forEach((map) => {
        if (map.tileSize) {
            map.tileSize = 1024;
        } // Force 1024 down/up scale

        tileLayers[map.name] = L.tileLayer(
            map.url,
            Object.assign(
                {
                    minZoom: -2,
                    maxZoom: 2,
                    tileSize: 1024,
                    maxNativeZoom: 0,
                    minNativeZoom: 0,
                    tileDirectory: config.tileDirectory,
                },
                map
            )
        );
    });

    CurrentLayer = tileLayers[Object.keys(tileLayers)[0]];

    Map = L.map(elementID, {
        crs: L.CRS.Simple,
        layers: [CurrentLayer],
    }).setView([0, 0], 0);

    let mapBounds = Utils.getMapBounds(CurrentLayer);
    Map.setMaxBounds(mapBounds.pad(1)); // Give the user some "wiggle room" before the map snaps back into bounds
    Map.fitBounds(mapBounds);

    new L.Control.CustomLayer(tileLayers).addTo(Map);
    Map.addLayer(PlayerMarkers);
};

export const createMarker = (draggable, objectRef, title) => {
    let name = objectRef.reference;
    if (name === "@DEBUG@@Locator") {
        name = "@Locator";
    }

    objectRef.position = Utils.stringCoordToFloat(objectRef.position);
    let coord = Utils.convertToMapLeaflet(
        CurrentLayer,
        objectRef.position.x,
        objectRef.position.y
    );
    let markerType = objectRef.type;

    let html = Utils.getPositionHtml(objectRef.position);

    if (objectRef.description !== "") {
        html += Utils.getHtmlForInformation(
            t("map.description"),
            objectRef.description
        );
    }

    let infoContent = Utils.getInfoHtmlForMarkers(name, html);

    let image = L.icon(markerType);

    let where = Map;
    if (objectRef.data && objectRef.data.isPlayer && config.groupPlayers) {
        // Add to the cluster layer
        where = PlayerMarkers;
    }

    if (where === undefined) {
        console.warn(
            "For some reason window.MapL or window.PlayerMarkers is undefined"
        );
        console.warn("Cannot add the blip: " + objectRef);
        where = createClusterLayer();
    }

    let marker = L.marker(coord, {
        title: title,
        id: MarkerStore.length,
        icon: image,
        object: objectRef,
        player: objectRef.data.player ? objectRef.data.player : undefined,
        draggable: draggable ? true : false,
    })
        .addTo(where)
        .bindPopup(infoContent);

    MarkerStore.push(marker);
    return MarkerStore.length;
};

export const createClusterLayer = () => {
    PlayerMarkers = L.markerClusterGroup({
        // Re-make it fresh
        maxClusterRadius: 20,
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false,
    });
    Map.addLayer(PlayerMarkers); // Add it back. The clearAllMarkers() will ensure player markers are added to the new cluster layer
    //initPlayerMarkerControls(Map, PlayerMarkers); //Reinitialise the event to allow clicking...
    return PlayerMarkers;
};

export const setMapCenter = (lat, lng) => {
    Map.setCenter([lat, lng]);
    Map.setZoom(6);
};

export const setMapCenterLeaflet = (coord) => {
    Map.setCenter(coord);
    Map.setZoom(6);
};

export const clearAllMarkers = () => {
    for (let i = 0; i < MarkerStore.length; i++) {
        clearMarker(i);
    }
    MarkerStore.length = 0;

    // Re-do player markers
    for (let id in localPlayerCache) {
        localPlayerCache[id].marker = null;
    }

    if (Map !== undefined) {
        Map.removeLayer(PlayerMarkers); // Remove the cluster layer
        PlayerMarkers = undefined;

        setTimeout(createClusterLayer, 10);
    }
};

export const clearMarker = (id) => {
    if (MarkerStore[id] !== "NULL") {
        MarkerStore[id].remove();
        //document.getElementById(`marker_${id}`).remove();
        Map.removeLayer(MarkerStore[id]);
        //delete this.MarkerStore[id];

        MarkerStore[id] = null;
    }
};

export const getMarker = (id) => {
    if (MarkerStore[id] !== "NULL") {
        return MarkerStore[id];
    }
};

export const getBlipMarker = (blip) => {
    if (blips[blip.type] === null) {
        return -1;
    }

    var blipArrayForType = blips[blip.type];

    for (var b in blipArrayForType) {
        var blp = blipArrayForType[b];

        if (
            blp.pos.x === blip.pos.x &&
            blp.pos.y === blip.pos.y &&
            blp.pos.z === blip.pos.z
        ) {
            return { index: b, blip: blp };
        }
    }

    // Couldn't find it..
    return -1;
};

export const doesBlipExist = (blip) => {
    return getBlipMarker(blip) !== -1;
};

export const addBlip = (blipObj) => {
    let spriteId = blipObj.type;

    if (doesBlipExist(blipObj)) {
        return; // Meh, it already exists.. Just don't add it
    }

    if (!Object.prototype.hasOwnProperty.call(blipObj, "name")) {
        // Doesn't have a name
        if (
            MarkerTypes[spriteId] === null ||
            MarkerTypes[spriteId].name === undefined
        ) {
            // No stored name, make one up. All markers _should_ have a name though.
            blipObj.name = "Dynamic Marker";
        } else {
            blipObj.name = MarkerTypes[spriteId].name;
        }
    }

    if (!Object.prototype.hasOwnProperty.call(blipObj, "description")) {
        // Doesn't have a description
        blipObj.description = "";
    }

    createBlip(blipObj);
};

export const removeBlip = (blipObj) => {
    if (doesBlipExist(blipObj)) {
        // Remove it

        let blp = getBlipMarker(blipObj);
        let markerId = blp.blip.markerId;
        let index = blp.index;

        clearMarker(markerId);

        blips[blipObj.type].splice(index, 1);

        if (blips[blipObj.type].length === 0) {
            delete blips[blipObj.type];
        }

        blipCount--;
        document.getElementById("blipCount").textContent = blipCount;
    }
};

export const updateBlip = (blipObj) => {
    if (doesBlipExist(blipObj)) {
        // Can update it
        let blp = getBlipMarker(blipObj);
        let markerId = blp.blip.markerId;
        let blipIndex = blp.index;

        let marker = MarkerStore[markerId];

        if (Object.prototype.hasOwnProperty.call(blipObj, "new_pos")) {
            // Blips are supposed to be static so, why this would even be fucking needed it beyond me
            // Still, better to prepare for the inevitability that someone wants this fucking feature
            marker.setLatLng(
                Utils.convertToMap(
                    CurrentLayer,
                    blipObj.new_pos.x,
                    blipObj.new_pos.y
                )
            );
            blipObj.pos = blipObj.new_pos;
            delete blipObj.new_pos;
        }

        let name = "No name blip..";
        let html = "";

        if (Object.prototype.hasOwnProperty.call(blipObj, "name")) {
            name = blipObj.name;
        } else {
            // No name given, might as well use the default one... If it exists...
            if (
                MarkerTypes[blipObj.type] !== undefined &&
                MarkerTypes[blipObj.type].name !== undefined
            ) {
                name = MarkerTypes[blipObj.type].name;
            }
        }

        for (let key in blipObj) {
            if (key === "name" || key === "type") {
                continue; // Name is already shown
            }

            if (key === "pos") {
                html += Utils.getPositionHtml(blipObj[key]);
            } else {
                // Make sure the first letter of the key is capitalised
                key[0] = key[0].toUpperCase();
                html += Utils.getHtmlForInformation(key, blipObj[key]);
            }
        }

        let info = Utils.getInfoHtmlForMarkers(name, html);

        marker.unbindPopup();
        marker.bindPopup(info);

        blips[blipObj.type][blipIndex] = blipObj;
    }
};

export const playerLeft = (playerName) => {
    if (
        localPlayerCache[playerName] !== undefined &&
        (localPlayerCache[playerName].marker !== null ||
            localPlayerCache[playerName].marker !== undefined)
    ) {
        //clearMarker(localPlayerCache[playerName].marker);
        clearMarker(localPlayerCache[playerName].marker);
        delete localPlayerCache[playerName];
    }

    let playerSelect = document.querySelector(
        `#playerSelect option[value='${playerName}']`
    );
    if (playerSelect) {
        playerSelect.remove();
    }

    let playerCount = Object.keys(localPlayerCache).length;

    console.log("Playerleft playercount: " + playerCount);

    document.getElementById("playerCount").innerText = playerCount;
};

export const doPlayerUpdate = (players) => {
    // console.log(players);

    players.forEach(doPlayerHtmlUpdates);

    let playerCount = Object.keys(localPlayerCache).length;

    console.log("playercount: " + playerCount);
    document.getElementById("playerCount").textContent = playerCount;
};

export const doPlayerHtmlUpdates = (plr) => {
    if (plr === null || plr.name === undefined || plr.name === "") return;
    if (plr.identifier === undefined || plr.identifier === "") return;

    if (!(plr.identifier in localPlayerCache)) {
        localPlayerCache[plr.identifier] = {
            marker: null,
            lastHtml: null,
        };
    }

    // Filtering stuff

    // If this player has a new property attached to them that we haven't seen before, add it to the filer
    let p = Utils.getFilterProps(plr);
    //console.log("Can filter on: ", p);
    p.forEach((_p) => {
        //console.log("THIS INSIDE OF FOREACH = ", this);
        if (!CanFilterOn.includes(_p)) {
            let filterOption = document.createElement("option");
            filterOption.value = _p;
            filterOption.innerText = _p;
            filterOption.className = "text-info";

            CanFilterOn.push(_p);
            //     $("#filterOn").append(`<option value="${_p}">${_p}</option>`);
            document.getElementById("filterOn").appendChild(filterOption);
        }
    });

    let opacity = 1.0;
    if (Filter !== undefined) {
        if (plr[Filter.on] === undefined) {
            opacity = 0.0;
        } else {
            let value = document.getElementById("onlyShow").value;
            if (value !== "" && !plr[Filter.on].includes(value)) {
                opacity = 0.0;
            }
        }
    }

    let selectPlayerOptions = document.getElementById("playerSelect");
    // console.log("selectPlayerOptions", selectPlayerOptions);

    if (!Utils.optionExists(plr.identifier, selectPlayerOptions)) {
        // They're not an option to track. Add them!
        let playerOption = document.createElement("option");
        playerOption.value = plr.identifier;
        playerOption.innerText = plr.name;
        playerOption.className = "text-info"; // Parent will have `text-danger` some times so, override it here

        selectPlayerOptions.appendChild(playerOption);
    }

    if (trackPlayer !== null && trackPlayer === plr.identifier) {
        // If we're tracking a player, make sure we center them
        Map.panTo(Utils.convertToMap(CurrentLayer, plr.pos.x, plr.pos.y));
    }

    const playerMarkerInLocalCache = localPlayerCache[plr.identifier].marker;
    const playerMarkerFromStore = MarkerStore[playerMarkerInLocalCache];

    if (playerMarkerFromStore) {
        // If we have a custom icon (we should) use it!!
        if (plr.icon) {
            let t = MarkerTypes[plr.icon];

            //console.log("Got icon of :" + plr.icon);
            playerMarkerFromStore.setIcon(L.icon(t));
        }

        // Update the player's location on the map :)
        playerMarkerFromStore.setLatLng(
            Utils.convertToMapLeaflet(CurrentLayer, plr.pos.x, plr.pos.y)
        );

        //update popup with the information we have been sent
        let html = Utils.getPlayerInfoHtml(plr);

        //let infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-header">' + plr.name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";
        let infoContent = Utils.getInfoHtmlForMarkers(plr.name, html);

        let marker = playerMarkerFromStore;
        let popUp = PopupStore[playerMarkerInLocalCache];

        marker.setOpacity(opacity);

        if (infoContent !== localPlayerCache[plr.identifier].lastHtml) {
            popUp.setContent(infoContent);
            localPlayerCache[plr.identifier].lastHtml = infoContent;
        }

        // Move the popup with the player
        if (popUp.isOpen()) {
            if (popUp.getLatLng().distanceTo(marker.getLatLng()) !== 0) {
                popUp.setLatLng(marker.getLatLng());
            }
        }
    } else {
        let html = Utils.getPlayerInfoHtml(plr);
        //let infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-icon"></div><div class="info-header">' + plr.name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";
        let infoContent = Utils.getInfoHtmlForMarkers(plr.name, html);
        localPlayerCache[plr.identifier].lastHtml = infoContent;

        let obj = new MarkerObject(
            plr.name,
            new Coordinates(plr.pos.x, plr.pos.y, plr.pos.z),
            MarkerTypes[6],
            "",
            { isPlayer: true, player: plr }
        );
        let m = (localPlayerCache[plr.identifier].marker =
            createMarker(false, obj, plr.name) - 1);

        MarkerStore[m].unbindPopup(); // We want to handle the popups ourselves.
        MarkerStore[m].setOpacity(opacity);

        PopupStore[m] = L.popup()
            .setContent(infoContent)
            .setLatLng(MarkerStore[m].getLatLng()); // Make a new marker

        MarkerStore[m].on("click", playerMarker_onClick);
    }
};

export const setTrackPlayer = (plr) => (trackPlayer = plr);
export const setFilter = (flt) => (Filter = flt);
export const setShowBlips = (sb) => (showBlips = sb);
