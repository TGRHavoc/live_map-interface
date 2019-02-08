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
window.CurrentLayer = undefined;

L.Control.CustomLayer = L.Control.Layers.extend({
    _checkDisabledLayers: function () {}
});

function mapInit(elementID) {

    // Create the different layers
    var tileLayers = {};
    var maps = window.config.maps;
    maps.forEach(map => {
        console.log(map);
        tileLayers[map.name] = L.tileLayer(map.url,
            Object.assign(
            { minZoom: -2, maxZoom: 0, maxNativeZoom: 0, minNativeZoom: 0, tileSize: 1024, tileDirectory: config.tileDirectory },
            map)
        );
        console.log(tileLayers[map.name]);
    });

    CurrentLayer = tileLayers[Object.keys(tileLayers)[0]];

    window.Map = L.map(elementID, {
        crs: L.CRS.Simple,
        layers: [CurrentLayer]
    }).setView([0,0], 0);

    var h = CurrentLayer.options.tileSize * 3,
        w = CurrentLayer.options.tileSize * 2;

    var southWest = Map.unproject([0, h], Map.getMaxZoom());
    var northEast = Map.unproject([w, 0], Map.getMaxZoom());
    var mapBounds = new L.LatLngBounds(southWest, northEast);

    Map.setMaxBounds(mapBounds);
    var control = new L.Control.CustomLayer(tileLayers).addTo(Map);

    Map.on("baselayerchange", function (e) {
        var h = e.layer.options.tileSize * 3,
            w = e.layer.options.tileSize * 2;

        var southWest = Map.unproject([0, h], Map.getMaxZoom());
        var northEast = Map.unproject([w, 0], Map.getMaxZoom());

        var mapBounds = new L.LatLngBounds(southWest, northEast);

        Map.setMaxBounds(mapBounds);
        Map.fitBounds(mapBounds);
        CurrentLayer = e.layer;

        clearAllMarkers();
        toggleBlips();
    });

    Map.on('preclick', function (e) {
        console.log("Preclick!");
        console.log(e);
    });
}

function createMarker(animated, draggable, objectRef, title) {

    var name = objectRef.reference;
    if (name == "@DEBUG@@Locator") {
        name = "@Locator";
    }
    objectRef.position = stringCoordToFloat(objectRef.position);
    //console.log(objectRef.position);
    var coord = convertToMapLeaflet(objectRef.position.x, objectRef.position.y);
    //console.log(coord);
    var markerType = objectRef.type;

    //console.log(JSON.stringify(locationType));

    var html = '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + objectRef.position.x.toFixed(2) + "} Y {" + objectRef.position.y.toFixed(2) + "} Z {" + objectRef.position.z.toFixed(2) + "}</div>";

    if (objectRef.description != ""){
        html += '<div class="row info-body-row"><strong>Description:</strong>&nbsp;' + objectRef.description + "</div>";
    }

    var infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-header">' + name + '</div></div><div class="clear"></div><div class=info-body>' + html + "</div></div>";

    var image = L.icon(markerType);
    //console.log(image);
    //console.log("image: " + JSON.stringify(image));

    var marker = L.marker(coord, {
        title: title,
        id: MarkerStore.length,
        icon: image,
        object: objectRef,
        draggable: draggable ? true : false
    }).addTo(Map).bindPopup(infoContent);

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
        if (MarkerStore[i] != "NULL") {
            MarkerStore[i].remove();
        }
    }
    MarkerStore.length = 0;
    // Re-do player markers
    for(var id in localCache){
        localCache[id].marker = null;
    }
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
