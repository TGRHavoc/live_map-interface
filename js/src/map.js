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
    "Normal": L.tileLayer("images/tiles/normal/minimap_sea_{y}_{x}.png", { maxNativeZoom: 0 }), //Originally had the "tileSize" attribute set. Removing it allows for the "zoomed out" look
    "Postal": L.tileLayer("images/tiles/postal/minimap_sea_{y}_{x}.png", { maxNativeZoom: 0 })
};

function mapInit(elementID) {
    _MAP_map = L.map(elementID, {
        maxZoom: 3,
        minZoom: 0,
        crs: L.CRS.Simple,
        layers: [_MAP_tiles["Normal"]]
    }).setView([0, 0], 0);

    var mapBounds = [[0,256*2], [-256*3, 0]];
    
    //_MAP_map.fitBounds(mapBounds);
    _MAP_map.setMaxBounds(mapBounds);
    //L.rectangle(mapBounds).addTo(_MAP_map);

    L.control.layers(_MAP_tiles).addTo(_MAP_map);

    _MAP_map.on("baselayerchange", function (e) {
        console.log(e.layer);
        //var recent = _MAP_map.unproject([e.layer.options.tileSize, e.layer.options.tileSize], _MAP_map.getMaxZoom());
        //_MAP_map.setView(recent, 0);
    });

    _MAP_map.on('click', function (e) {
        console.log(e);
    });
    //L.tileLayer("images/tiles/minimap_{y}_{x}.png", {tileSize: 512}).addTo(_MAP_map);
}

function createMarker(animated, draggable, objectRef, title) {

    var name = objectRef.reference;
    if (name == "@DEBUG@@Locator") {
        name = "@Locator";
    }
    objectRef.position = stringCoordToFloat(objectRef.position);
    console.log(objectRef.position);
    var coord = convertToMapLeaflet(objectRef.position.x, objectRef.position.y);
    console.log(coord);
    var markerType = objectRef.type;

    //console.log(JSON.stringify(locationType));

    var html = '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + objectRef.position.x.toFixed(2) + "} Y {" + objectRef.position.y.toFixed(2) + "} Z {" + objectRef.position.z.toFixed(2) + "}</div>";

    if (objectRef.description != ""){
        html += '<div class="row info-body-row"><strong>Description:</strong>&nbsp;' + objectRef.description + "</div>";
    }

    var infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-header">' + name + '</div></div><div class="clear"></div><div class=info-body>' + html + "</div></div>";

    var image = L.icon(markerType);
    console.log(image);
    //console.log("image: " + JSON.stringify(image));

    var marker = L.marker(coord, {
        title: title,
        id: _MAP_markerStore.length,
        icon: image,
        object: objectRef,
        draggable: draggable ? true : false
    }).addTo(_MAP_map).bindPopup(infoContent);

    /*
    var marker = new google.maps.Marker({
        id: _MAP_markerStore.length,
        type: locationType.name,
        position: coord,
        icon: image,
        map: _MAP_map,
        popup: infoBox,
        object: objectRef,
        draggable: draggable ? true : false,
        animation: animated ? google.maps.Animation.DROP : 0
    });
    
    if (name == "@DEBUG@@Locator") {
        $("#marker-list").append('<div id="marker_' + marker.id + '" data-id="' + marker.id + '" class="marker-item"><div class="marker-desc"><span class="marker_name">@Locator</span></div><div class="marker-options"><a href="#" class="marker_view" title="View"><img src="images/icons/view.png" alt="View" height="16" width="16" /></a> </div></div><div class="clear"></div>');
    } else {
        $("#marker-list").append('<div id="marker_' + marker.id + '" data-id="' + marker.id + '" class="marker-item"><div class="marker-desc"><span class="marker_name">' + name + '</span></div><div class="marker-options"><a href="#" class="marker_view" title="View"><img src="images/icons/view.png" alt="View" height="16" width="16" /></a> / <a href="#" class="marker_delete" title="Delete"><img src="images/icons/delete.png" alt="Delete" height="16" width="16" /></a></div></div><div class="clear"></div>');
    }
    */
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
