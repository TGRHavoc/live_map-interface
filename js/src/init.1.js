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

// Ugly hack. Please. Avert eyes.
_log = console._log = function(message, ...params){
    if(window.config.debug){
        params.unshift(message);
        console.log.apply(this, params);
    }
}

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
var _blipControlToggleAll = true; // Show all by default

window.Filter = undefined; // For filtering players
window.CanFilterOn = []; // What can the user filter?

window.changeServer = function (nameOfServer) {
    console._log("Changing connected server to: " + nameOfServer);

    if (!(nameOfServer in config.servers)) {
        createAlert({
            title: "<strong>Couldn't load server config!</strong>",
            message: `The server "${nameOfServer}" doesn't exist in the config file.`
        });
        return;
    }

    window.connectedTo = config.servers[nameOfServer];

    window.connectedTo.getBlipUrl = function () {
        if (this.reverseProxy && this.reverseProxy.blips) {
            return this.reverseProxy.blips;
        }
        return `http://${this.ip}:${this.socketPort}/blips.json`;
    }

    window.connectedTo.getSocketUrl = function () {
        if (this.reverseProxy && this.reverseProxy.socket) {
            return this.reverseProxy.socket;
        }
        return `ws://${this.ip}:${this.socketPort}`;
    }

    // If we've changed servers. Might as well reset everything.
    if (window.webSocket && window.webSocket.readyState == WebSocket.OPEN) window.webSocket.close();

    $("#server_name").text(nameOfServer);

    // Reset controls.
    $("#playerSelect").children().remove();
    $("#playerSelect").append("<option></option>");

    $("#filterOn").children().remove();
    $("#filterOn").append("<option></option>");
    $("#onlyShow").text("");
    window.Filter = undefined;

    setTimeout(() => {
        initBlips(connectedTo.getBlipUrl());
        connect(connectedTo.getSocketUrl());
    }, 50);
}

function globalInit() {
    // Init config

    $.ajax("config.json", {
        error: function (textStatus, errorThrown) {
            createAlert({
                title: "<strong>Error getting config, cannot load map!</strong>",
                message: textStatus.statusText
            });
        },
        dataType: "text", // We want to strip any comments in the file first
        success: function (data, textStatus) {
            var str = stripJsonOfComments(data);
            var p = JSON.parse(str);

            window.config = Object.assign({
                debug: false,
                tileDirectory: "images/tiles",
                iconDirectory: "images/icons",
                showIdentifiers: false,
                groupPlayers: true,
                servers: []
            }, p);

            for (const serverName in config.servers) {
                // Make sure all servers inherit defaults if they need
                var o = Object.assign({}, config.defaults, config.servers[serverName]);
                config.servers[serverName] = o;
            }
            mapInit("map-canvas");
            initMarkers();
            initPage();


            changeServer(Object.keys(p.servers)[0]); // Show the stuff for the first server in the config.
        }
    });
}
function initPage() {
    $(window).on("load resize", function() {
        $(".map-tab-content").height((($("#tab-content").height() - $(".page-title-1").height()) - ($("#map-overlay-global-controls").height() * 4.2)));
    });

    for (const serverName in config.servers) {
        $("#server_menu").append("<a class='dropdown-item serverMenuItem' href='#'>" + serverName + "</a>");
    }

    var $myGroup = $('#control-wrapper');
    $myGroup.on('show.bs.collapse','.collapse', function() {
        console._log("hidding?");
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

    while(window.Map == undefined){
        // Just wait..
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

    console._log(_blipCount + " blips created");
    $("#blip_count").text(_blipCount);
    toggleBlips();
}

function blipError( textStatus, errorThrown){
    console.error("Error \"" + JSON.stringify(textStatus) + "\": " + errorThrown);

    createAlert({
        title: "<strong>Error getting blips!</strong>",
        message: "Maybe the server is down or, the config is setup incorrectly."
    });

}

function initBlips(url){
    clearAllMarkers();
    _blipCount = 0;
    _blips = [];

    console._log("Sending ajax request to " + url);
    $.ajax(url, {
        error: blipError,
        dataType: "json",
        success: blipSuccess
    });
}
