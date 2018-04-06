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

var _invervalId;
var _isLive = false;
var _blips = [];
var _blipCount = 0;
var _showBlips = true;
var _isConnected = false;
var _trackPlayer = null;
var playerCount = 0;
var _overlays = [];
var _disabledBlips = [];

function globalInit() {
    mapInit("map-canvas");
    initPage();
    initBlips();

    for (var i = 0; i < _overlays.length; i++) {
        var o = _overlays[i];
        $("#overlaySelect").append(`<option value="${i}">${o.name}</option>`);
    }

}

function initPage() {
    $(window).on("load resize", function() {
        $(".map-tab-content").height((($("#tab-content").height() - $(".page-title-1").height()) - ($("#map-overlay-global-controls").height() * 4.2)));
    });

    var $myGroup = $('#control-wrapper');
    $myGroup.on('show.bs.collapse','.collapse', function() {
        console.log("hidding?");
        $myGroup.find('.collapse.show').collapse('hide');
    });

}

function getBlipMarkerId(blip){
    if(_blips[blip.type] == null){
        return -1;
    }

    var blipArrayForType = _blips[blip.type];

    for(var b in blipArrayForType){
        var blp = blipArrayForType[b];

        if (blp.pos.x == blip.pos.x && blp.pos.y == blip.pos.y && blp.pos.z == blip.pos.z){
            return blp.markerId;
        }
    }

    // Couldn't find it..
    return -1;
}

function getBlipIndex(blip){
    if (_blips[blip.type] == null){
        return -1;
    }

    var blipArrayForType = _blips[blip.type];

    for(var b in blipArrayForType){
        var blp = blipArrayForType[b];

        if (blp.pos.x == blip.pos.x && blp.pos.y == blip.pos.y && blp.pos.z == blip.pos.z){
            return b;
        }
    }

    // Couldn't find it..
    return -1;
}

function createBlip(blip){
    if (!blip.hasOwnProperty("pos")){
        // BACKWARDS COMPATABILITY!!
        blip.pos = { x: blip.x, y: blip.y, z: blip.z};

        //Delete the old shit.. It's nicly wrapped in the pos object now
        delete blip.x;
        delete blip.y;
        delete blip.z;
    }

    var obj = new MarkerObject(blip.name, new Coordinates(blip.pos.x, blip.pos.y, blip.pos.z), MarkerTypes[blip.type], blip.description, "", "");

    if (_blips[blip.type] == null){
        _blips[blip.type] = [];
    }

    blip.markerId = createMarker(false, false, obj, "") - 1;

    _blips[blip.type].push(blip);
    _blipCount++;
}

function blipSuccess(data, textStatus){
    if (data.error){
        //Do something about the error i guess.
        console.error("Error: " + data.error);
        //createAlert("warning", "Error getting blips!", data.error);
        createAlert({
            title: "<strong>Error getting blips!</strong>",
            message: data.error
        }, {delay: 0});
        return;
    }

    for (var spriteId in data) {
        if (data.hasOwnProperty(spriteId)) {
            // data[spriteId] == array of blips for that type
            var blipArray = data[spriteId];

            for (var i in blipArray) {
                var blip = blipArray[i];
                var fallbackName = (MarkerTypes[spriteId] != undefined && MarkerTypes[spriteId].hasOwnProperty("name")) ? MarkerTypes[spriteId].name : "Unknown Name... Please make sure the sprite exists.";

                blip.name = (blip.hasOwnProperty("name") || blip.name != null) ? blip.name : fallbackName;
                blip.description = (blip.hasOwnProperty("description") || blip.description != null) ? blip.description : "";

                blip.type = spriteId;

                createBlip(blip);
            }
        }
    }

    console.log(_blipCount + " blips created");
    $("#blip_count").text(_blipCount);

}

function blipError( textStatus, errorThrown){
    console.error("Error \"" + JSON.stringify(textStatus) + "\": " + errorThrown);

    createAlert({
        title: "<strong>Error getting blips!</strong>",
        message: "Maybe the server is down or, the config is setup incorrectly."
    });

}

function initBlips(){
    _blipCount = 0;
    _blips = [];

    console.log("Sending ajax request to " + _SETTINGS_blipUrl);
    $.ajax(_SETTINGS_blipUrl, {
        error: blipError,
        dataType: "json",
        success: blipSuccess
    });
}

function initMarkers(debugOnly) {
    if (debugOnly) {
        createMarker(false, true, new MarkerObject("@DEBUG@@Locator", new Coordinates(0, 500, 0), MarkerTypes[999], "", ""), "");
        console.log("MarkerType: " + MarkerTypes[999]);
    } else {
        createMarker(false, false, new MarkerObject("True Map Center", new Coordinates(0, 0, 0), MarkerTypes[6], "", ""), "");
    }
}
