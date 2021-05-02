// ************************************************************************** //
//            LiveMap Interface - The web interface for the livemap
//                    Copyright (C) 2017  Jordan Dalton
//
//      This program is free software: you can redistribute it and/or modify
//      it under the terms of the GNU General Public License as published by
//      the Free Software Foundation, either version 3 of the License, or
//      (at your option) any later version.
//
//      This program is distributed in the hope that it will be useful,
//      but WITHOUT ANY WARRANTY; without even the implied warranty of
//      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//      GNU General Public License for more details.
//
//      You should have received a copy of the GNU General Public License
//      along with this program in the file "LICENSE".  If not, see <http://www.gnu.org/licenses/>.
// ************************************************************************** //

window.MarkerStore = [];
window.PopupStore = {}; // MarkerId : Popup
window.CurrentLayer = undefined;
window.PlayerMarkers = L.markerClusterGroup({
    maxClusterRadius: 20,
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false
});

L.Control.CustomLayer = L.Control.Layers.extend({
    _checkDisabledLayers: function () {}
});

function mapInit(elementID) {

    // Create the different layers
    var tileLayers = {};
    var maps = window.config.maps;
    maps.forEach(map => {
        console._log(map);
        if (map.tileSize){ map.tileSize = 1024; } // Force 1024 down/up scale

        tileLayers[map.name] = L.tileLayer(map.url,
            Object.assign(
            { minZoom: -2, maxZoom: 2, tileSize: 1024, maxNativeZoom: 0, minNativeZoom: 0, tileDirectory: config.tileDirectory },
            map)
        );
        console._log(tileLayers[map.name]);
    });

    CurrentLayer = tileLayers[Object.keys(tileLayers)[0]];

    window.Map = L.map(elementID, {
        crs: L.CRS.Simple,
        layers: [CurrentLayer]
    }).setView([0,0], 0);

    var mapBounds = getMapBounds(CurrentLayer);

    Map.setMaxBounds(mapBounds);
    Map.fitBounds(mapBounds);

    var control = new L.Control.CustomLayer(tileLayers).addTo(Map);
    Map.addLayer(PlayerMarkers);

    initMapControl(Map);
    initPlayerMarkerControls(Map, PlayerMarkers);
}

function createMarker(animated, draggable, objectRef, title) {

    var name = objectRef.reference;
    if (name == "@DEBUG@@Locator") {
        name = "@Locator";
    }
    objectRef.position = stringCoordToFloat(objectRef.position);
    //console._log(objectRef.position);
    var coord = convertToMapLeaflet(objectRef.position.x, objectRef.position.y);
    //console._log(coord);
    var markerType = objectRef.type;

    //console._log(JSON.stringify(locationType));

    var html = '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + objectRef.position.x.toFixed(2) + "} Y {" + objectRef.position.y.toFixed(2) + "} Z {" + objectRef.position.z.toFixed(2) + "}</div>";

    if (objectRef.description != ""){
        html += '<div class="row info-body-row"><strong>Description:</strong>&nbsp;' + objectRef.description + "</div>";
    }

    var infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-header">' + name + '</div></div><div class="clear"></div><div class=info-body>' + html + "</div></div>";

    var image = L.icon(markerType);

    var where = window.Map;
    if(objectRef.data && objectRef.data.isPlayer && window.config.groupPlayers){
        // Add to the cluster layer
        where = window.PlayerMarkers;
    }
    if(where == undefined){
        console.warn("For some reason window.Map or window.PlayerMarkers is undefined");
        console.warn("Cannot add the blip: " + objectRef);
        where = createClusterLayer();
    }

    var marker = L.marker(coord, {
        title: title,
        id: MarkerStore.length,
        icon: image,
        object: objectRef,
        player: objectRef.data.player ? objectRef.data.player : undefined,
        draggable: draggable ? true : false
    }).addTo(where).bindPopup(infoContent);

    MarkerStore.push(marker);
    return MarkerStore.length;
}

function setMapCenter(lat, lng) {
    Map.setCenter([lat, lng]);
    Map.setZoom(6);
}

function setMapCenterLeaflet(coord) {
    Map.setCenter(coord);
    Map.setZoom(6);
}

function clearAllMarkers() {
    for (var i = 0; i < MarkerStore.length; i++) {
        clearMarker(i);
    }
    MarkerStore.length = 0;

    // Re-do player markers
    for(var id in localCache){
        localCache[id].marker = null;
    }
    if(Map != undefined){
        Map.removeLayer(window.PlayerMarkers); // Remove the cluster layer
        window.PlayerMarkers = undefined;

        setTimeout(createClusterLayer, 10);
    }
}

function createClusterLayer(){
    window.PlayerMarkers = L.markerClusterGroup({ // Re-make it fresh
        maxClusterRadius: 20,
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: false
    });
    Map.addLayer(window.PlayerMarkers); // Add it back. The clearAllMarkers() will ensure player markers are added to the new cluster layer
    initPlayerMarkerControls(Map, PlayerMarkers); //Reinitialise the event to allow clicking...
    return window.PlayerMarkers;
}

function clearMarker(id) {
    if (MarkerStore[id] != "NULL") {
        MarkerStore[id].remove();
        MarkerStore[id] = "NULL";
        $("#marker_" + id).remove();
    }
}

function getMarker(id) {
    if (MarkerStore[id] != "NULL") {
        return MarkerStore[id];
    }
};
