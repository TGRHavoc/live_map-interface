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

var socketUrl = _SETTINGS_socketUrl;

function connect() {
    webSocket = new WebSocket(socketUrl);

    webSocket.onopen = function (e) {
        onOpen(e);
    };

    webSocket.onmessage = function (e) {
        onMessage(e);
    };

    webSocket.onerror = function (e) {
        onError(e);
    };

    webSocket.onclose = function (e) {
        onClose(e);
    };
}

function onOpen(e) {
    _isConnected = true;
    if (_SETTINGS_debug) {
        console.log("_isConnected: " + _isConnected);
    }

    // New websocket server doesn't need to recieve this
    //webSocket.send("getPlayerData"); // Get any players connected to the server

    $("#connection").removeClass("badge-danger")
        .removeClass("badge-warning")
        .addClass("badge-success").text("connected");
    $("#socket_error").text("");
}

function sorter(plr1, plr2){
    var str1 = plr1["name"];
    var str2 = plr2["name"];

    return (str1 < str2) ? -1 : (str1 > str2) ? 1 : 0;
}

function onMessage(e) {
    var m = encodeURIComponent(e.data).match(/%[89ABab]/g);
    var byteSize = e.data.length + (m ? m.length : 0);

    if (_SETTINGS_debug) {
        console.log("recieved message (" + byteSize / 1024 + " kB)");
        console.log("data: " + e.data);
    }

    var data = JSON.parse(e.data);

    if (data.type == "addBlip" || data.type == "updateBlip" || data.type == "removeBlip") {
        // BACKWARDS COMPATABILITY!!
        if (!data.payload.hasOwnProperty("pos")) {
            data.payload.pos = { x: data.payload.x, y: data.payload.y, z: data.payload.z };

            delete data.payload.x;
            delete data.payload.y;
            delete data.payload.z;
        }
    }

    if (data.type == "addBlip") {
        addBlip(data.payload);

    } else if (data.type == "removeBlip") {
        removeBlip(data.payload);

    } else if (data.type == "updateBlip") {
        updateBlip(data.payload);

    } else if (data.type == "playerData") {
        //console.log("updating players(" + typeof(data.payload) + "): " + JSON.stringify(data.payload));
        var sortedPlayers = data.payload.sort(sorter);
        doPlayerUpdate(sortedPlayers);

    } else if (data.type == "playerLeft") {
        //console.log("player left:" + data.payload);
        playerLeft(data.payload);
    }
}

function onError(e) {
    // from http://stackoverflow.com/a/28396165
    var reason;
    // See http://tools.ietf.org/html/rfc6455#section-7.4.1
    if (event.code == 1000) {
        reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
    } else if (event.code == 1001) {
        reason = "Server is going down or a browser having navigated away from a page.";
    } else if (event.code == 1002) {
        reason = "An endpoint is terminating the connection due to a protocol error";
    } else if (event.code == 1003) {
        reason = "Wrong data type recieved by the server";
    } else if (event.code == 1004) {
        reason = "Reserved. The specific meaning might be defined in the future.";
    } else if (event.code == 1005) {
        reason = "No status code was actually present.";
    } else if (event.code == 1006) {
        reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
    } else if (event.code == 1007) {
        reason = "Server has received data within a message that was not consistent with the type of the message.";
    } else if (event.code == 1008) {
        reason = "Server has received a message that 'violates its policy'.";
    } else if (event.code == 1009) {
        reason = "Server received a message that is too big for it to process.";
    } else if (event.code == 1010) { // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
        reason = "Client expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake.\n Specifically, the extensions that are needed are: " + event.reason;
    } else if (event.code == 1011) {
        reason = "Server encountered an unexpected condition that prevented it from fulfilling the request.";
    } else if (event.code == 1015) {
        reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
    } else {
        reason = "Unknown reason (Server is probably down)";
    }

    //$("#socket_error").text(reason);
    console.error("Socket error: " + reason);
    if(_SETTINGS_debug){
        //createAlert("warning", "Socket error", ["There was an error with the socket connnection", reason], 2);
        createAlert({
            title: "<strong>Socket error!</strong>",
            message: `There was an error with the socket connection: ${reason}`
        });
    }
}

function onClose(e) {
    $("#connection").removeClass("badge-success")
        .removeClass("badge-warning")
        .addClass("badge-danger").text("disconnected");

    _isConnected = false;
}

var localCache = {};

function doesBlipExist(blip) {
    if (_blips[blip.type] == null) {
        return false;
    }

    var blipArrayForType = _blips[blip.type];

    for (var b in blipArrayForType) {
        var blp = blipArrayForType[b];

        if (blp.pos.x == blip.pos.x && blp.pos.y == blip.pos.y && blp.pos.z == blip.pos.z) {
            return true;
        }
    }

    return false;
}

function addBlip(blipObj) {
    if (doesBlipExist(blipObj)) {
        return; // Meh, it already exists.. Just don't add it
    }

    if (!blipObj.hasOwnProperty("name")) { // Doesn't have a name
        if (MarkerTypes[spriteId] == null || MarkerTypes[spriteId].name == undefined) {
            // No stored name, make one up
            blipObj.name = "Dynamic Marker";
        } else {
            blipObj.name = MarkerTypes[spriteId].name;
        }
    }

    if (!blipObj.hasOwnProperty("description")) { // Doesn't have a description
        blipObj.description = "";
    }

    createBlip(blipObj);
}

function removeBlip(blipObj) {
    if (doesBlipExist(blipObj)) {
        // Remove it

        var markerId = getBlipMarkerId(blipObj);
        var index = getBlipIndex(blipObj);
        clearMarker(markerId);

        _blips[blipObj.type].splice(index, 1);

        if (_blips[blipObj.type].length == 0) {
            delete _blips[blipObj.type];
        }

        _blipCount--;
        $("#blip_count").text(_blipCount);
    }
}

function updateBlip(blipObj) {
    if (doesBlipExist(blipObj)) {
        // Can update it
        var markerId = getBlipMarkerId(blipObj);
        var blipIndex = getBlipIndex(blipObj);

        var marker = _MAP_markerStore[markerId];

        if (blipObj.hasOwnProperty("new_pos")) {
            // Blips are supposed to be static so, why this would even be fucking needed it beyond me
            // Still, better to prepare for the inevitability that someone wants this fucking feature
            marker.setPosition(convertToMapGMAP(blipObj.new_pos.x, blipObj.new_pos.y, blipObj.new_pos.z));
            blipObj.pos = blipObj.new_pos;
            delete blipObj.new_pos;
        }

        var name = "No name blip..";
        var html = "";

        if (blipObj.hasOwnProperty("name")) {
            name = blipObj.name;
        } else {
            // No name given, might as well use the default one... If it exists...
            if (MarkerTypes[blipObj.type] != undefined && MarkerTypes[blipObj.type].name != undefined) {
                name = MarkerTypes[blipObj.type].name;
            }
        }

        for (var key in blipObj) {

            if (key == "name" || key == "type") {
                continue; // Name is already shown
            }

            if (key == "pos") {
                html += '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + blipObj.pos.x.toFixed(2) + "} Y {" + blipObj.pos.y.toFixed(2) + "} Z {" + blipObj.pos.z.toFixed(2) + "}</div>";
            } else {
                // Make sure the first letter of the key is capitalised
                key[0] = key[0].toUpperCase();
                html += '<div class="row info-body-row"><strong>' + key + ":</strong>&nbsp;" + blipObj[key] + "</div>";
            }
        }

        var info = '<div class="info-window"><div class="info-header-box"><div class="info-header">' + name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";

        marker.popup.setContent(info);

        _blips[blipObj.type][blipIndex] = blipObj;
    }
}

function playerLeft(playerName) {
    if (localCache[playerName].marker != null || localCache[playerName].marker != undefined) {
        clearMarker(localCache[playerName].marker);
        delete localCache[playerName];
    }

    if ($("#playerSelect option[value='" + playerName + "']").length > 0) {
        $("#playerSelect option[value='" + playerName + "']").remove();
    }

    playerCount = Object.keys(localCache).length;
    if (_SETTINGS_debug) {
        console.log("Playerleft playercount: " + playerCount);
    }
    $("#player_count").text(playerCount);
}

function getPlayerInfoHtml(plr) {
    var html = '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + plr.pos.x.toFixed(2) + "} Y {" + plr.pos.y.toFixed(2) + "} Z {" + plr.pos.z.toFixed(2) + "}</div>";
    for (var key in plr) {
        //console.log("found key: "+ key);
        if (key == "name" || key == "pos" || key == "icon") { // I should probably turn this into a array or something
            continue; // We're already displaying this info
        }

        if (!(key === "identifer")) {
            html += '<div class="row info-body-row"><strong>' + key + ':</strong>&nbsp;' + plr[key] + '</div>';
        } else if (_SETTINGS_showIdentifiers && key == "identifer") {
            html += '<div class="row info-body-row"><strong>Identifer:</strong>&nbsp;' + plr[key] + '</div>';
        } else {
            continue;
        }
    }

    return html;
}

function doPlayerUpdate(players) {

    if (_SETTINGS_debug) {
        console.log(players);
    }

    players.forEach(function (plr) {
        if (plr == null || plr.name == undefined || plr.name == "") return;

        if (!(plr.identifer in localCache)) {
            // "localCache" literally just keeps track of the marker.. I should rename it
            //TODO: Rename "localCache" to something better
            localCache[plr.identifer] = { marker: null };
        }

        if ($("#playerSelect option[value='" + plr.identifer + "']").length <= 0) {
            // Ooo look, we have players. Let's add them to the "tracker" drop-down
            $("#playerSelect").append($("<option>", {
                value: plr.identifer, // Should be unique
                text: plr.name // Their name.. Might not be unique?
            }));
        }

        if (_trackPlayer != null && _trackPlayer == plr.identifer) {
            // If we're tracking a player, make sure we center them
            map.panTo(convertToMapGMAP(plr.pos.x, plr.pos.y));
        }

        if (localCache[plr.identifer].marker != null || localCache[plr.identifer].marker != undefined) {
            // If we have a custom icon (we should) use it!!
            if (plr.icon) {
                var t = MarkerTypes[plr.icon];
                //console.log("Got icon of :" + plr.icon);
                _MAP_markerStore[localCache[plr.identifer].marker].setIcon({
                    url: _MAP_iconURL + t.icon,
                    size: t.size,
                    origin: t.origin,
                    anchor: t.anchor,
                    scaledSize: t.scaledSize
                });
            }

            // Update the player's location on the map :)
            _MAP_markerStore[localCache[plr.identifer].marker].setPosition(convertToMapGMAP(plr.pos.x, plr.pos.y));

            //update popup with the information we have been sent
            var html = getPlayerInfoHtml(plr);

            var infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-header">' + plr.name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";
            var infoBox = new google.maps.InfoWindow({
                content: infoContent
            });
            _MAP_markerStore[localCache[plr.identifer].marker].popup.setContent(infoContent);

        } else {

            var obj = new MarkerObject(plr.name, new Coordinates(plr.pos.x, plr.pos.y, plr.pos.z), MarkerTypes[6], "", "", "");
            var m = localCache[plr.identifer].marker = createMarker(false, false, obj, plr.name) - 1;

            var html = getPlayerInfoHtml(plr);

            var infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-icon"></div><div class="info-header">' + plr.name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";
            var infoBox = new google.maps.InfoWindow({
                content: infoContent
            });
            _MAP_markerStore[m].popup.setContent(infoContent);

        }

    });

    playerCount = Object.keys(localCache).length;
    if (_SETTINGS_debug) {
        console.log("playercount: " + playerCount);
    }
    $("#player_count").text(playerCount);
}
