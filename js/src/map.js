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
var _MAP_markerStore;

var bounds = {
    3: 2,
    4: 5,
    5: 10,
    6: 21,
    7: 42
};
function getNormalizedCoord(coord, zoom) {
    var y = coord.y;
    var x = coord.x;

    // tile range in one direction range is dependent on zoom level
    // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
    var tileRange = 1 << zoom;

    // don't repeat across y-axis (vertically)
    if (y < 0 || y >= tileRange) {
        return null;
    }

    // repeat across x-axis
    if (x < 0 || x >= tileRange) {
        x = (x % tileRange + tileRange) % tileRange;
    }

    return {
        x: x,
        y: y
    };
}

// Start atlas
var mapAtlasOptions = {
    getTileUrl: function(coord, zoom) {
        var normalizedCoord = getNormalizedCoord(coord, zoom);
        if (!normalizedCoord || normalizedCoord.x > bounds[zoom] || normalizedCoord.y > bounds[zoom]) {
            return null;
        }
        return _MAP_tileURL + 'atlas/' +  zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.png';
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 7,
    name: "Atlas",
    alt: "GTA V Atlas Map"
};
var mapAtlas = new google.maps.ImageMapType(mapAtlasOptions);
mapAtlas.projection = new EuclideanProjection();
//End atlas

//Start satellite
var mapSatelliteOptions = {
    getTileUrl: function(coord, zoom) {
        var normalizedCoord = getNormalizedCoord(coord, zoom);
        if (!normalizedCoord || normalizedCoord.x > bounds[zoom] || normalizedCoord.y > bounds[zoom]) {
            return null;
        }
        return _MAP_tileURL + 'satellite/' +  zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.png';
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 7,
    name: "Satellite",
    alt: "GTA V Satellite Map"
};
var mapSatellite = new google.maps.ImageMapType(mapSatelliteOptions);
mapSatellite.projection = new EuclideanProjection();
//end satellite

//start road
var mapRoadOptions = {
    getTileUrl: function(coord, zoom) {
        var normalizedCoord = getNormalizedCoord(coord, zoom);
        if (!normalizedCoord || normalizedCoord.x > bounds[zoom] || normalizedCoord.y > bounds[zoom]) {
            return null;
        }
        return _MAP_tileURL + 'road/' +  zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.png';
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 7,
    //minZoom: 5,
    name: "Road",
    alt: "GTA V Road Map"
};
var mapRoad = new google.maps.ImageMapType(mapRoadOptions);
mapRoad.projection = new EuclideanProjection();
//end road

//start UV
var mapUVInvOptions = {
    getTileUrl: function(coord, zoom) {
        var normalizedCoord = getNormalizedCoord(coord, zoom);
        if (!normalizedCoord || normalizedCoord.x > bounds[zoom] || normalizedCoord.y > bounds[zoom]) {
            return null;
        }
        return _MAP_tileURL + 'uv-invert/' +  zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.png';
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 7,
    name: "UV Invert",
    alt: "GTA V UV Invert Map"
};
var mapUVInv = new google.maps.ImageMapType(mapUVInvOptions);
mapUVInv.projection = new EuclideanProjection();
//end uv

// Postcode map
var mapPostcodeOptions = {
    getTileUrl: function(coord, zoom) {
        var normalizedCoord = getNormalizedCoord(coord, zoom);
        if (!normalizedCoord || normalizedCoord.x > bounds[zoom] || normalizedCoord.y > bounds[zoom]) {
            return null;
        }
        return _MAP_tileURL + 'postcode/' +  zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.png';
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 7,
    name: "Postcode",
    alt: "GTA V Postcode Map"
};
var mapPostcode = new google.maps.ImageMapType(mapPostcodeOptions);
mapPostcode.projection = new EuclideanProjection();
//end postcode

function mapInit(elementID) {
    _MAP_markerStore = [];
    var centerCoords = convertToMapGMAP(315.7072466019408, 1701.7513644599276);
    var mapID = [];
    _MAP_atlasMap ? mapID.push("Atlas") : null;
    _MAP_satelliteMap ? mapID.push("Satellite") : null;
    _MAP_roadMap ? mapID.push("Road") : null;
    _MAP_UVInvMap ? mapID.push("UV Invert") : null;
    _MAP_PostcodeMap ? mapID.push("Postcode") : null;
    var mapOptions = {
        backgroundColor: "inherit",
        minZoom: 3,
        maxZoom: 7,
        isPng: true,
        mapTypeControl: true,
        streetViewControl: false,
        center: centerCoords,
        zoom: 4,
        mapTypeControlOptions: {
            mapTypeIds: mapID
        }
    };
    map = new google.maps.Map(document.getElementById(elementID), mapOptions);
    _MAP_atlasMap ? map.mapTypes.set("Atlas", mapAtlas) : null;
    _MAP_satelliteMap ? map.mapTypes.set("Satellite", mapSatellite) : null;
    _MAP_roadMap ? map.mapTypes.set("Road", mapRoad) : null;
    _MAP_UVInvMap ? map.mapTypes.set("UV Invert", mapUVInv) : null;
    _MAP_PostcodeMap ? map.mapTypes.set("Postcode", mapPostcode) : null;

    //TODO: Maybe make this an option or something?
    //_overlays.push(streetOverlayImages);

    //TODO: If a postcode overlay get made or something, add it here too..

    map.setMapTypeId("Atlas");
    google.maps.event.addListener(map, "maptypeid_changed", function() {
        var type = map.getMapTypeId();
        switch (type) {
            case "Atlas":
            case "Postcode":
                $("#" + elementID).css({
                    "background-color": "#0fa8d2"
                });
                break;
            case "Satellite":
                $("#" + elementID).css({
                    "background-color": "#143d6b"
                });
                break;
            case "Road":
                $("#" + elementID).css({
                    "background-color": "#1862ad"
                });
                break;
            case "UV Invert":
                $("#" + elementID).css({
                    "background-color": "#f2f0b6"
                });
                break;
        }
    });
}

function createMarker(animated, draggable, objectRef, title) {

    var name = objectRef.reference;
    if (name == "@DEBUG@@Locator") {
        name = "@Locator";
    }
    objectRef.position = stringCoordToFloat(objectRef.position);
    var coord = convertToMapGMAP(objectRef.position.x, objectRef.position.y);
    var locationType = objectRef.type;

    //console.log(JSON.stringify(locationType));

    var html = '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + objectRef.position.x.toFixed(2) + "} Y {" + objectRef.position.y.toFixed(2) + "} Z {" + objectRef.position.z.toFixed(2) + "}</div>";

    if (objectRef.description != ""){
        html += '<div class="row info-body-row"><strong>Description:</strong>&nbsp;' + objectRef.description + "</div>";
    }

    var infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-header">' + name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";
    var infoBox = new google.maps.InfoWindow({
        content: infoContent
    });
    var image = {
        url: _MAP_iconURL + locationType.icon,
        size: locationType.size,
        origin: locationType.origin,
        scaledSize: locationType.scaledSize == undefined ? locationType.size : locationType.scaledSize,
        anchor: locationType.anchor
    };
    //console.log("image: " + JSON.stringify(image));
    var marker = new google.maps.Marker({
        id: _MAP_markerStore.length,
        type: locationType.name,
        position: coord,
        icon: image,
        map: map,
        popup: infoBox,
        object: objectRef,
        draggable: draggable ? true : false,
        animation: animated ? google.maps.Animation.DROP : 0
    });
    google.maps.event.addListener(marker, "click", function() {
        if (_MAP_currentMarker) {
            _MAP_currentMarker.popup.close();
        }
        _MAP_currentMarker = marker;
        marker.popup.open(map, this);
    });
    google.maps.event.addListener(marker, "drag", function() {
        var posConverted = convertToGame(marker.position.lat(), marker.position.lng());
        objectRef.position.x = posConverted.x;
        objectRef.position.y = posConverted.y;
        if (objectRef.reference == "@DEBUG@@Locator") {
            $("#locator_x").val(posConverted.x);
            $("#locator_y").val(posConverted.y);
        }
    });
    if (name == "@DEBUG@@Locator") {
        $("#marker-list").append('<div id="marker_' + marker.id + '" data-id="' + marker.id + '" class="marker-item"><div class="marker-desc"><span class="marker_name">@Locator</span></div><div class="marker-options"><a href="#" class="marker_view" title="View"><img src="images/icons/view.png" alt="View" height="16" width="16" /></a> </div></div><div class="clear"></div>');
    } else {
        $("#marker-list").append('<div id="marker_' + marker.id + '" data-id="' + marker.id + '" class="marker-item"><div class="marker-desc"><span class="marker_name">' + name + '</span></div><div class="marker-options"><a href="#" class="marker_view" title="View"><img src="images/icons/view.png" alt="View" height="16" width="16" /></a> / <a href="#" class="marker_delete" title="Delete"><img src="images/icons/delete.png" alt="Delete" height="16" width="16" /></a></div></div><div class="clear"></div>');
    }
    _MAP_markerStore.push(marker);
    return _MAP_markerStore.length;
}

function setMapCenter(lat, lng) {
    map.setCenter(new google.maps.LatLng(lat, lng));
    map.setZoom(6);
}

function setMapCenterGMAP(coord) {
    map.setCenter(coord);
    map.setZoom(6);
}

function clearAllMarkers() {
    for (var i = 0; i < _MAP_markerStore.length; i++) {
        if (_MAP_markerStore[i] != "NULL") {
            _MAP_markerStore[i].setMap(null);
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
        _MAP_markerStore[id].setMap(null);
        _MAP_markerStore[id] = "NULL";
        $("#marker_" + id).remove();
    }
}

function getMarker(id) {
    if (_MAP_markerStore[id] != "NULL") {
        return _MAP_markerStore[id];
    }
};
