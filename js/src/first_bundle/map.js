/// <reference path="./config.js" />
/// <reference path="./1_utils.js" />
/// <reference path="./socket.js" />

L.Control.CustomLayer = L.Control.Layers.extend({
    _checkDisabledLayers: function () {}
});

class MapWrapper {

    /**
     * Creates an instance of MapWrapper.
     * @param {SocketHandler} socketHandler
     * @memberof MapWrapper
     */
    constructor(socketHandler){
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

        this.mapInit("map-canvas");
    }

    changeServer(nameOfServer){
        Config.log("Changing connected server to: " + nameOfServer);
        if (!(nameOfServer in Config.staticConfig.servers)) {
            Alerter.createAlert({
                title: window.Translator.t("errors.server-config.title"),
                text: window.Translator.t("errors.server-config.message", {nameOfServer})
            });
            return;
        }

        this.connectedTo = Config.staticConfig.servers[nameOfServer];

        this.connectedTo.getBlipUrl = function () {
            // this = the "connectedTo" server
            if (this.reverseProxy && this.reverseProxy.blips) {
                return this.reverseProxy.blips;
            }
            return `http://${this.ip}:${this.socketPort}/blips.json`;
        }

        this.connectedTo.getSocketUrl = function () {
            // this = the "connectedTo" server
            if (this.reverseProxy && this.reverseProxy.socket) {
                return this.reverseProxy.socket;
            }
            return `ws://${this.ip}:${this.socketPort}`;
        }

        // If we've changed servers. Might as well reset everything.
        if (this.socketHandler.webSocket && this.socketHandler.webSocket.readyState == WebSocket.OPEN) this.socketHandler.webSocket.close();

        // $("#server_name").text(nameOfServer);

        // // Reset controls.
        // $("#playerSelect").children().remove();
        // $("#playerSelect").append("<option></option>");

        // $("#filterOn").children().remove();
        // $("#filterOn").append("<option></option>");
        // $("#onlyShow").text("");
        this.Filter = undefined;

        const _ = this;
        setTimeout( function () {
            Initializer.blips(_.connectedTo.getBlipUrl(), window.markers);

            _.socketHandler.connect(_.connectedTo.getSocketUrl());
        }, 50);
    }

    mapInit(elementID){
        // Create the different layers
        const config = Config.getConfig();
        let tileLayers = {};
        let maps = config.maps;
        maps.forEach(map => {
            Config.log(map);
            if (map.tileSize){ map.tileSize = 1024; } // Force 1024 down/up scale

            tileLayers[map.name] = L.tileLayer(map.url,
                Object.assign(
                { minZoom: -2, maxZoom: 2, tileSize: 1024, maxNativeZoom: 0, minNativeZoom: 0, tileDirectory: config.tileDirectory },
                map)
            );
            Config.log(tileLayers[map.name]);
        });

        this.CurrentLayer = tileLayers[Object.keys(tileLayers)[0]];

        this.Map =  window.MapL = L.map(elementID, {
            crs: L.CRS.Simple,
            layers: [this.CurrentLayer]
        }).setView([0,0], 0);

        let mapBounds = Utils.getMapBounds(this.CurrentLayer);

        this.Map.setMaxBounds(mapBounds);
        this.Map.fitBounds(mapBounds);

        let control = new L.Control.CustomLayer(tileLayers).addTo(this.Map);
        this.Map.addLayer(this.PlayerMarkers);

        // initMapControl(Map);
        // initPlayerMarkerControls(Map, PlayerMarkers);
    }

    createMarker(draggable, objectRef, title) {
        let name = objectRef.reference;
        if (name == "@DEBUG@@Locator") {
            name = "@Locator";
        }
        objectRef.position = Utils.stringCoordToFloat(objectRef.position);
        //Config.log(objectRef.position);
        let coord = Utils.convertToMapLeaflet(objectRef.position.x, objectRef.position.y);
        //Config.log(coord);
        let markerType = objectRef.type;

        //Config.log(JSON.stringify(locationType));

        let html = '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + objectRef.position.x.toFixed(2) + "} Y {" + objectRef.position.y.toFixed(2) + "} Z {" + objectRef.position.z.toFixed(2) + "}</div>";

        if (objectRef.description != ""){
            html += '<div class="row info-body-row"><strong>Description:</strong>&nbsp;' + objectRef.description + "</div>";
        }

        let infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-header">' + name + '</div></div><div class="clear"></div><div class=info-body>' + html + "</div></div>";

        let image = L.icon(markerType);

        let where = this.Map;
        if(objectRef.data && objectRef.data.isPlayer && Config.getMarker().groupPlayers){
            // Add to the cluster layer
            where = this.PlayerMarkers;
        }
        if(where == undefined){
            console.warn("For some reason window.MapL or window.PlayerMarkers is undefined");
            console.warn("Cannot add the blip: " + objectRef);
            where = this.createClusterLayer();
        }

        let marker = L.marker(coord, {
            title: title,
            id: MarkerStore.length,
            icon: image,
            object: objectRef,
            player: objectRef.data.player ? objectRef.data.player : undefined,
            draggable: draggable ? true : false
        }).addTo(where).bindPopup(infoContent);

        this.MarkerStore.push(marker);
        return MarkerStore.length;
    }

    createClusterLayer(){
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
        for(let id in this.socketHandler.localCache){
            this.socketHandler.localCache[id].marker = null;
        }
        if(this.Map != undefined){
            this.Map.removeLayer(this.PlayerMarkers); // Remove the cluster layer
            this.PlayerMarkers = undefined;

            setTimeout(this.createClusterLayer.call(this), 10);
        }
    }

    clearMarker(id) {
        if (this.MarkerStore[id] != "NULL") {
            this.MarkerStore[id].remove();
            this.MarkerStore[id] = "NULL";
            document.getElementById(`marker_${id}`).remove();
        }
    }

    getMarker(id) {
        if (this.MarkerStore[id] != "NULL") {
            return this.MarkerStore[id];
        }
    }
}
