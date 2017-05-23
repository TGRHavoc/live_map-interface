var socketUrl = _SETTINGS_socketUrl;

function connect(){
    webSocket = new WebSocket(socketUrl);

    webSocket.onopen = function (e) {
      onOpen (e);
    };

    webSocket.onmessage = function (e) {
      onMessage (e);
    };

    webSocket.onerror = function (e) {
      onError (e);
    };

    webSocket.onclose = function (e) {
      onClose (e);
    };
}

function onOpen(e){
    _isConnected = true;
    console.log("_isConnected: " + _isConnected);
    // Get blips?
    webSocket.send("getBlips");
    webSocket.send("getLocations"); // Get any players connected to the server

    $("#connection").removeClass("label-danger")
        .removeClass("label-warning")
        .addClass("label-success").text("connected");
    $("#socket_error").text("");

}
function onMessage(e){
    var m = encodeURIComponent(e.data).match(/%[89ABab]/g);
    var byteSize = e.data.length + (m ? m.length : 0);

    console.log("recieved message (" + byteSize/1024 + " kB)");
    var data = JSON.parse(e.data);

    if(data.type == "blips"){
        console.log("creating blips");
        initBlips(data.payload);

    }else if (data.type == "players") {
        console.log("updating players");
        doPlayerUpdate(data.payload);

    }else if(data.type == "playerLeft"){
        console.log("player left:" + data.payload);
        playerLeft(data.payload);
    }
}

function onError(e){
    // from http://stackoverflow.com/a/28396165
    var reason;
    // See http://tools.ietf.org/html/rfc6455#section-7.4.1
    if (event.code == 1000)
        reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
    else if(event.code == 1001)
        reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
    else if(event.code == 1002)
        reason = "An endpoint is terminating the connection due to a protocol error";
    else if(event.code == 1003)
        reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
    else if(event.code == 1004)
        reason = "Reserved. The specific meaning might be defined in the future.";
    else if(event.code == 1005)
        reason = "No status code was actually present.";
    else if(event.code == 1006)
       reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
    else if(event.code == 1007)
        reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).";
    else if(event.code == 1008)
        reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
    else if(event.code == 1009)
       reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
    else if(event.code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
        reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
    else if(event.code == 1011)
        reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
    else if(event.code == 1015)
        reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
    else
        reason = "Unknown reason (Server is probably down)";

    $("#socket_error").text(reason);

    if (_isLive){
        clearInterval(_invervalId);
    }

}
function onClose(e){
    $("#connection").removeClass("label-success")
        .removeClass("label-warning")
        .addClass("label-danger").text("disconnected");

    _isConnected = false;
    if (_isLive){
        clearInterval(_invervalId);
    }

}

function addBlip(blip, bool){
    //_blipCount++;
}

function initBlips(blips){
    _blipCount = 0;
    _blips = [];
    clearAllMarkers();

    if (_showBlips){
        blips.forEach(function(blip){
            var desc = blip.description == undefined ? "" : blip.description;
            var obj = new MarkerObject(blip.name, new Coordinates(blip.x, blip.y, blip.z), MarkerTypes[blip.type], desc, "", "");

            _blips[_blipCount++] = blip;

            createMarker(false, false, obj, "");
        });
    }

    console.log(_blipCount + " blips created");
    $("#blip_count").text(_blipCount);
}

var localCache = {};

function playerLeft(playerName){
    if (localCache[playerName].marker != null || localCache[playerName].marker != undefined){
        clearMarker(localCache[playerName].marker);
        localCache[playerName].marker = null;
    }

    if ($("#playerSelect option[value='" + playerName + "']").length > 0){
        $("#playerSelect option[value='" + playerName + "']").remove();
    }
}

function doPlayerUpdate(players){
    var playerCount = 0;
    players.forEach(function(plr){
        playerCount ++;
        if (plr == null) return;

        if ($("#playerSelect option[value='" + plr.id + "']").length <= 0){
            $("#playerSelect").append($("<option>", {
                value: plr.id,
                text: plr.name
            }));
        }

        if (plr.id in localCache){

            //console.log(JSON.stringify(plr));
            //console.log(JSON.stringify(localCache[plr.name]));

            if (plr.x == localCache[plr.id].player.x
                && plr.y == localCache[plr.id].player.y
                && plr.z == localCache[plr.id].player.z){
                    //Don't update position.. Player hasn't moved
                    console.log("Player " + plr.name + " hasn't moved");
            }else{
                console.log("updated local cache for " + plr.name);
                //console.log(JSON.stringify(plr));
                localCache[plr.id].player = plr;

                if (localCache[plr.id].marker != null || localCache[plr.id].marker != undefined){
                    //update postion
                    _MAP_markerStore[localCache[plr.id].marker].setPosition( convertToMapGMAP(plr.x, plr.y) );

                    //update popup
                    var html = '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + plr.x.toFixed(4) + "} Y {" + plr.y.toFixed(4) + "} Z {" + plr.z.toFixed(4) + "}</div>";
                    var infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-icon"></div><div class="info-header">' + plr.name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";
                    var infoBox = new google.maps.InfoWindow({
                        content: infoContent
                    });
                    _MAP_markerStore[localCache[plr.id].marker].popup.setContent(infoContent);
                }
            }

        }else{
            localCache[plr.id] = {};
            localCache[plr.id].player = plr;
            var obj = new MarkerObject(plr.name, new Coordinates(plr.x, plr.y, plr.z), MarkerTypes.normal, "A player", "", "");
            createMarker(false, false, obj, plr.name);

            localCache[plr.id].marker = _MAP_markerStore.length - 1;
        }
    });

    console.log("Playercount: " + playerCount);
    $("#player_count").text(playerCount);
}
