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

var _MAP_currentMarker;
var _MAP_markerStore = [];
var _MAP_map;

var _MAP_tiles = {
    "Normal": L.tileLayer("images/tiles/normal/minimap_sea_{y}_{x}.png", { minZoom: -2, maxZoom: 0, maxNativeZoom: 0, minNativeZoom: 0, tileSize: 1024 }), //Originally had the "tileSize" attribute set. Removing it allows for the "zoomed out" look
    "Postal": L.tileLayer("images/tiles/postal/minimap_sea_{y}_{x}.png", { minZoom: -4, maxZoom: 0, maxNativeZoom: 0, minNativeZoom: 0, tileSize: 3072 })
};

var _MAP_currentLayer = _MAP_tiles["Normal"];

function mapInit(elementID) {

    // Create the different layers
    var maps = window.config.maps;
    console.log("maps:" + maps);

    _MAP_map = L.map(elementID, {
        crs: L.CRS.Simple,
        layers: [_MAP_currentLayer]
    }).setView([0,0], 0);

    // Use the "normal" bounds since, it's default.
    var h = _MAP_currentLayer.options.tileSize * 3,
        w = _MAP_currentLayer.options.tileSize * 2;

    var southWest = _MAP_map.unproject([0, h], _MAP_map.getMaxZoom());
    var northEast = _MAP_map.unproject([w, 0], _MAP_map.getMaxZoom());
    var mapBounds = new L.LatLngBounds(southWest, northEast);

    _MAP_map.setMaxBounds(mapBounds);
    L.control.layers(_MAP_tiles).addTo(_MAP_map);

    _MAP_map.on("baselayerchange", function (e) {
        var h = e.layer.options.tileSize * 3,
            w = e.layer.options.tileSize * 2;

        var southWest = _MAP_map.unproject([0, h], _MAP_map.getMaxZoom());
        var northEast = _MAP_map.unproject([w, 0], _MAP_map.getMaxZoom());

        var mapBounds = new L.LatLngBounds(southWest, northEast);

        _MAP_map.setMaxBounds(mapBounds);
        _MAP_currentLayer = e.layer;

        clearAllMarkers();
        toggleBlips();
    });

    _MAP_map.on('click', function (e) {
        //console.log(e);
    });
    //L.tileLayer("images/tiles/minimap_{y}_{x}.png", {tileSize: 512}).addTo(_MAP_map);

    ///_MAP_map.setCenter([w * 0.5, h * 0.5]);
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
        id: _MAP_markerStore.length,
        icon: image,
        object: objectRef,
        draggable: draggable ? true : false
    }).addTo(_MAP_map).bindPopup(infoContent);

    _MAP_markerStore.push(marker);
    return _MAP_markerStore.length;
}

function setMapCenter(lat, lng) {
    _MAP_map.setCenter([lat, lng]);
    _MAP_map.setZoom(6);
}

function setMapCenterLeaflet(coord) {
    _MAP_map.setCenter(coord);
    _MAP_map.setZoom(6);
}

function clearAllMarkers() {
    for (var i = 0; i < _MAP_markerStore.length; i++) {
        if (_MAP_markerStore[i] != "NULL") {
            _MAP_markerStore[i].remove();
        }
    }
    _MAP_markerStore.length = 0;
    // Re-do player markers
    for(var id in localCache){
        localCache[id].marker = null;
    }
}

function clearMarker(id) {
    if (_MAP_markerStore[id] != "NULL") {
        _MAP_markerStore[id].remove();
        _MAP_markerStore[id] = "NULL";
        $("#marker_" + id).remove();
    }
}

function getMarker(id) {
    if (_MAP_markerStore[id] != "NULL") {
        return _MAP_markerStore[id];
    }
};
