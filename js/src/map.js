/// <reference path="./socket.js" />

import { Config } from "./config.js";
import { Utils } from "./utils.js";
import { Initializer } from "./init.js";
import { Alerter } from "./alerter.js";
import { MarkerObject, Coordinates } from "./objects.js";
import { Markers } from "./markers.js";
import { Controls } from "./controls.js";


L.Control.CustomLayer = L.Control.Layers.extend({
    _checkDisabledLayers: function () { }
});

class MapWrapper {

    /**
     * Creates an instance of MapWrapper.
     * @param {SocketHandler} socketHandler
     * @memberof MapWrapper
     */
    constructor(socketHandler) {
        this.MarkerStore = [];
        this.PopupStore = {}; // { MarkerId: Popup }
        this.CurrentLayer = undefined;
        this.PlayerMarkers = L.markerClusterGroup({
            maxClusterRadius: 20,
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false
        });
        this.socketHandler = socketHandler;
        this.Map = undefined;
        this.connectedTo = {};

        this.Filter = undefined; // For filtering players
        this.CanFilterOn = []; // What can the user filter?

        this.blips = [];
        this.showBlips = true;
        this.disabledBlips = [];
        this.blipCount = 0;

        this.localPlayerCache = {};

        this.trackPlayer = null;

        this.mapInit("mapCanvas");

        this.controls = window.controls = new Controls(this); // This calls initControls internally
        this.markers = window.markers = new Markers(Config.getConfig(), this.controls);
    }

    createBlip(blip, markerTypes) {
        console.log("Creating blip", blip);
        if (!blip.hasOwnProperty("pos")) {
            // BACKWARDS COMPATABILITY!!
            blip.pos = { x: blip.x, y: blip.y, z: blip.z };

            //Delete the old shit.. It's nicly wrapped in the pos object now
            delete blip.x;
            delete blip.y;
            delete blip.z;
        }

        var obj = new MarkerObject(blip.name, new Coordinates(blip.pos.x, blip.pos.y, blip.pos.z), markerTypes[blip.type], blip.description, "", "");

        if (this.blips[blip.type] == null) {
            this.blips[blip.type] = [];
        }

        blip.markerId = this.createMarker(false, obj, "") - 1;

        this.blips[blip.type].push(blip);
        this.blipCount++;
    }

    toggleBlips() {
        for (var spriteId in this.blips) {
            var blipArray = this.blips[spriteId];
            console.log("Disabled (" + spriteId + ")? " + this.disabledBlips.includes(spriteId));

            if (this.disabledBlips.indexOf(spriteId) != -1) {
                //console.log("Blip " + spriteId + "'s are disabled..");

                blipArray.forEach(blip => {
                    //console.log(blip);
                    var marker = this.MarkerStore[blip.markerId];
                    marker.remove();
                });

                // If disabled, don't make a marker for it
                continue;
            }

            blipArray.forEach(blip => {
                //console.log(blip);
                var marker = this.MarkerStore[blip.markerId];
                if (this.showBlips) {
                    marker.addTo(this.Map);
                } else {
                    marker.remove();
                }
            });
        }
    }

    changeServer(nameOfServer) {
        console.log("Changing connected server to: " + nameOfServer);
        if (!(nameOfServer in Config.staticConfig.servers)) {
            new Alerter({
                title: window.Translator.t("errors.server-config.title"),
                text: window.Translator.t("errors.server-config.message", { nameOfServer })
            });
            return;
        }

        this.connectedTo = Config.staticConfig.servers[nameOfServer];
        this.clearAllMarkers(); // Make sure _all_ markers from previous server has been removed.

        this.connectedTo.getBlipUrl = function () {
            // this = the "connectedTo" server
            if (this.reverseProxy && this.reverseProxy.blips) {
                return this.reverseProxy.blips;
            }
            return `http://${this.ip}:${this.socketPort}/blips.json`;
        };

        this.connectedTo.getSocketUrl = function () {
            // this = the "connectedTo" server
            if (this.reverseProxy && this.reverseProxy.socket) {
                return this.reverseProxy.socket;
            }
            return `ws://${this.ip}:${this.socketPort}`;
        };

        // If we've changed servers. Might as well reset everything.
        if (this.socketHandler.webSocket && this.socketHandler.webSocket.readyState == WebSocket.OPEN) this.socketHandler.webSocket.close();

        // $("#serverName").text(nameOfServer);

        document.getElementById("serverName").innerText = nameOfServer;

        // // Reset controls.
        // $("#playerSelect").children().remove();
        // $("#playerSelect").append("<option></option>");

        // $("#filterOn").children().remove();
        // $("#filterOn").append("<option></option>");
        // $("#onlyShow").text("");
        this.Filter = undefined;

        const _ = this;
        setTimeout(function () {
            Initializer.blips(_.connectedTo.getBlipUrl(), window.markers, _);

            _.socketHandler.connect(_.connectedTo.getSocketUrl(), _);
        }, 50);
    }

    mapInit(elementID) {
        // Create the different layers
        const config = Config.getConfig();
        let tileLayers = {};
        let maps = config.maps;
        maps.forEach(map => {
            console.log(map);
            if (map.tileSize) { map.tileSize = 1024; } // Force 1024 down/up scale

            tileLayers[map.name] = L.tileLayer(map.url,
                Object.assign(
                    { minZoom: -2, maxZoom: 2, tileSize: 1024, maxNativeZoom: 0, minNativeZoom: 0, tileDirectory: config.tileDirectory },
                    map)
            );
            console.log(tileLayers[map.name]);
        });

        this.CurrentLayer = tileLayers[Object.keys(tileLayers)[0]];

        this.Map = window.MapL = L.map(elementID, {
            crs: L.CRS.Simple,
            layers: [this.CurrentLayer]
        }).setView([0, 0], 0);

        let mapBounds = Utils.getMapBounds(this.CurrentLayer);
        this.Map.setMaxBounds(mapBounds.pad(1)); // Give the user some "wiggle room" before the map snaps back into bounds
        this.Map.fitBounds(mapBounds);

        let control = new L.Control.CustomLayer(tileLayers).addTo(this.Map);
        this.Map.addLayer(this.PlayerMarkers);
    }

    createMarker(draggable, objectRef, title) {
        let name = objectRef.reference;
        if (name == "@DEBUG@@Locator") {
            name = "@Locator";
        }

        objectRef.position = Utils.stringCoordToFloat(objectRef.position);
        //console.log(objectRef.position);
        let coord = Utils.convertToMapLeaflet(this.CurrentLayer, objectRef.position.x, objectRef.position.y);
        //console.log(coord);
        let markerType = objectRef.type;
        const lang = window.Translator;

        //console.log(JSON.stringify(locationType));


        //TODO: TRANSLATE ENGLISH HERE
        let html = Utils.getPositionHtml(objectRef.position);
        //let html = '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + objectRef.position.x.toFixed(2) + "} Y {" + objectRef.position.y.toFixed(2) + "} Z {" + objectRef.position.z.toFixed(2) + "}</div>";

        if (objectRef.description != "") {
            //html += '<div class="row info-body-row"><strong>Description:</strong>&nbsp;' + objectRef.description + "</div>";
            html += Utils.getHtmlForInformation(lang.t("map.description"), objectRef.description);
        }

        //let infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-header">' + name + '</div></div><div class="clear"></div><div class=info-body>' + html + "</div></div>";
        let infoContent = Utils.getInfoHtmlForMarkers(name, html);

        let image = L.icon(markerType);

        let where = this.Map;
        if (objectRef.data && objectRef.data.isPlayer && Config.getConfig().groupPlayers) {
            // Add to the cluster layer
            where = this.PlayerMarkers;
        }
        if (where == undefined) {
            console.warn("For some reason window.MapL or window.PlayerMarkers is undefined");
            console.warn("Cannot add the blip: " + objectRef);
            where = this.createClusterLayer();
        }

        let marker = L.marker(coord, {
            title: title,
            id: this.MarkerStore.length,
            icon: image,
            object: objectRef,
            player: objectRef.data.player ? objectRef.data.player : undefined,
            draggable: draggable ? true : false
        }).addTo(where).bindPopup(infoContent);

        this.MarkerStore.push(marker);
        return this.MarkerStore.length;
    }

    createClusterLayer() {
        this.PlayerMarkers = L.markerClusterGroup({ // Re-make it fresh
            maxClusterRadius: 20,
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: false
        });
        this.Map.addLayer(this.PlayerMarkers); // Add it back. The clearAllMarkers() will ensure player markers are added to the new cluster layer
        //initPlayerMarkerControls(Map, PlayerMarkers); //Reinitialise the event to allow clicking...
        return this.PlayerMarkers;
    }

    setMapCenter(lat, lng) {
        this.Map.setCenter([lat, lng]);
        this.Map.setZoom(6);
    }

    setMapCenterLeaflet(coord) {
        this.Map.setCenter(coord);
        this.Map.setZoom(6);
    }

    clearAllMarkers() {
        for (let i = 0; i < this.MarkerStore.length; i++) {
            this.clearMarker(i);
        }
        this.MarkerStore.length = 0;

        // Re-do player markers
        for (let id in this.socketHandler.localCache) {
            this.localCache[id].marker = null;
        }
        if (this.Map != undefined) {
            this.Map.removeLayer(this.PlayerMarkers); // Remove the cluster layer
            this.PlayerMarkers = undefined;

            setTimeout(this.createClusterLayer.bind(this), 10);
        }
    }

    clearMarker(id) {
        if (this.MarkerStore[id] != "NULL") {
            this.MarkerStore[id].remove();
            //document.getElementById(`marker_${id}`).remove();
            this.Map.removeLayer(this.MarkerStore[id]);
            //delete this.MarkerStore[id];

            this.MarkerStore[id] = null;
        }
    }

    getMarker(id) {
        if (this.MarkerStore[id] != "NULL") {
            return this.MarkerStore[id];
        }
    }

    getBlipMarker(blip) {
        if (this.blips[blip.type] == null) {
            return -1;
        }

        var blipArrayForType = this.blips[blip.type];

        for (var b in blipArrayForType) {
            var blp = blipArrayForType[b];

            if (blp.pos.x == blip.pos.x && blp.pos.y == blip.pos.y && blp.pos.z == blip.pos.z) {
                return { index: b, blip: blp };
            }
        }

        // Couldn't find it..
        return -1;
    }

    doesBlipExist(blip) {
        return this.getBlipMarker(blip) != -1;
    }

    addBlip(blipObj) {
        let spriteId = blipObj.type;

        if (this.doesBlipExist(blipObj)) {
            return; // Meh, it already exists.. Just don't add it
        }

        if (!blipObj.hasOwnProperty("name")) { // Doesn't have a name
            if (this.markers.MarkerTypes[spriteId] == null || this.markers.MarkerTypes[spriteId].name == undefined) {
                // No stored name, make one up. All markers _should_ have a name though.
                blipObj.name = "Dynamic Marker";
            } else {
                blipObj.name = this.markers.MarkerTypes[spriteId].name;
            }
        }

        if (!blipObj.hasOwnProperty("description")) { // Doesn't have a description
            blipObj.description = "";
        }

        this.createBlip(blipObj);
    }

    removeBlip(blipObj) {
        if (this.doesBlipExist(blipObj)) {
            // Remove it

            let blp = this.getBlipMarker(blipObj);
            let markerId = blp.blip.markerId;
            let index = blp.index;

            this.clearMarker(markerId);

            this.blips[blipObj.type].splice(index, 1);

            if (this.blips[blipObj.type].length == 0) {
                delete this.blips[blipObj.type];
            }

            this.blipCount--;
            document.getElementById("blipCount").textContent = this.blipCount;
        }
    }

    updateBlip(blipObj) {
        if (this.doesBlipExist(blipObj)) {
            // Can update it
            let blp = this.getBlipMarker(blipObj);
            let markerId = blp.blip.markerId;
            let blipIndex = blp.index;

            let marker = this.MarkerStore[markerId];

            if (blipObj.hasOwnProperty("new_pos")) {
                // Blips are supposed to be static so, why this would even be fucking needed it beyond me
                // Still, better to prepare for the inevitability that someone wants this fucking feature
                marker.setLatLng(Utils.convertToMap(blipObj.new_pos.x, blipObj.new_pos.y, blipObj.new_pos.z));
                blipObj.pos = blipObj.new_pos;
                delete blipObj.new_pos;
            }

            let name = "No name blip..";
            let html = "";

            if (blipObj.hasOwnProperty("name")) {
                name = blipObj.name;
            } else {
                // No name given, might as well use the default one... If it exists...
                if (this.markers.MarkerTypes[blipObj.type] != undefined && this.markers.MarkerTypes[blipObj.type].name != undefined) {
                    name = this.markers.MarkerTypes[blipObj.type].name;
                }
            }

            for (let key in blipObj) {

                if (key == "name" || key == "type") {
                    continue; // Name is already shown
                }

                if (key == "pos") {
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

            this.blips[blipObj.type][blipIndex] = blipObj;
        }
    }

    playerLeft(playerName) {
        if (this.localPlayerCache[playerName] !== undefined &&
            (this.localPlayerCache[playerName].marker != null || this.localPlayerCache[playerName].marker != undefined)) {
            //clearMarker(localPlayerCache[playerName].marker);
            this.clearMarker(this.localPlayerCache[playerName].marker);
            delete this.localPlayerCache[playerName];
        }

        let playerSelect = document.querySelector(`#playerSelect option[value='${playerName}']`);
        if (playerSelect) {
            playerSelect.remove();
        }

        this.playerCount = Object.keys(this.localPlayerCache).length;

        console.log("Playerleft playercount: " + this.playerCount);

        document.getElementById("playerCount").innerText = this.playerCount;
    }

    doPlayerUpdate(players) {

        console.log(players);

        players.forEach(this.doPlayerHtmlUpdates.bind(this));

        this.playerCount = Object.keys(this.localPlayerCache).length;

        console.log("playercount: " + this.playerCount);
        document.getElementById("playerCount").textContent = this.playerCount;
    }

    doPlayerHtmlUpdates(plr) {

        if (plr == null || plr.name == undefined || plr.name == "") return;
        if (plr.identifier == undefined || plr.identifier == "") return;

        if (!(plr.identifier in this.localPlayerCache)) {
            this.localPlayerCache[plr.identifier] = { marker: null, lastHtml: null };
        }

        // Filtering stuff

        // If this player has a new property attached to them that we haven't seen before, add it to the filer
        let p = Utils.getFilterProps(plr);
        //console.log("Can filter on: ", p);
        p.forEach((_p) => {
            //console.log("THIS INSIDE OF FOREACH = ", this);
            if (!this.CanFilterOn.includes(_p)) {
                let filterOption = document.createElement("option");
                filterOption.value = _p;
                filterOption.innerText = _p;
                filterOption.className = "text-info";

                this.CanFilterOn.push(_p);
                //     $("#filterOn").append(`<option value="${_p}">${_p}</option>`);
                document.getElementById("filterOn").appendChild(filterOption);
            }
        });

        let opacity = 1.0;
        if (this.Filter != undefined) {
            if (plr[this.Filter.on] == undefined) {
                opacity = 0.0;
            } else {
                let value = document.getElementById("onlyShow").value;
                if (value != "" && !plr[this.Filter.on].includes(value)) {
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

        if (this.trackPlayer != null && this.trackPlayer == plr.identifier) {
            // If we're tracking a player, make sure we center them
            this.Map.panTo(Utils.convertToMap(this.CurrentLayer, plr.pos.x, plr.pos.y));
        }

        const playerMarkerInLocalCache = this.localPlayerCache[plr.identifier].marker;
        const playerMarkerFromStore = this.MarkerStore[playerMarkerInLocalCache];

        if (playerMarkerFromStore) {
            // If we have a custom icon (we should) use it!!
            if (plr.icon) {
                let t = this.markers.MarkerTypes[plr.icon];

                //console.log("Got icon of :" + plr.icon);
                playerMarkerFromStore.setIcon(L.icon(t));
            }

            // Update the player's location on the map :)
            playerMarkerFromStore.setLatLng(Utils.convertToMapLeaflet(this.CurrentLayer, plr.pos.x, plr.pos.y));

            //update popup with the information we have been sent
            let html = Utils.getPlayerInfoHtml(plr);

            //let infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-header">' + plr.name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";
            let infoContent = Utils.getInfoHtmlForMarkers(plr.name, html);

            let marker = playerMarkerFromStore;
            let popUp = this.PopupStore[playerMarkerInLocalCache];

            marker.setOpacity(opacity);

            if (infoContent != this.localPlayerCache[plr.identifier].lastHtml) {
                popUp.setContent(infoContent);
                this.localPlayerCache[plr.identifier].lastHtml = infoContent;
            }

            // Move the popup with the player
            if (popUp.isOpen()) {
                if (popUp.getLatLng().distanceTo(marker.getLatLng()) != 0) {
                    popUp.setLatLng(marker.getLatLng());
                }
            }


        } else {
            let html = Utils.getPlayerInfoHtml(plr);
            //let infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-icon"></div><div class="info-header">' + plr.name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";
            let infoContent = Utils.getInfoHtmlForMarkers(plr.name, html);
            this.localPlayerCache[plr.identifier].lastHtml = infoContent;

            let obj = new MarkerObject(plr.name, new Coordinates(plr.pos.x, plr.pos.y, plr.pos.z), this.markers.MarkerTypes[6], "", { isPlayer: true, player: plr });
            let m = this.localPlayerCache[plr.identifier].marker = this.createMarker(false, obj, plr.name) - 1;

            this.MarkerStore[m].unbindPopup(); // We want to handle the popups ourselves.
            this.MarkerStore[m].setOpacity(opacity);

            this.PopupStore[m] = L.popup()
                .setContent(infoContent)
                .setLatLng(this.MarkerStore[m].getLatLng()); // Make a new marker

            this.MarkerStore[m].on("click", this.controls.playerMarker_onClick.bind(this.controls, this));
        }
    }

}


export { MapWrapper }
