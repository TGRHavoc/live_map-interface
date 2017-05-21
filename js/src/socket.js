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
    // Get blips?
    webSocket.send("getBlips");
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
    //TODO: Handle it?
}
function onClose(e){

}

function initBlips(blips){
    var count = 0;
    clearAllMarkers();
    blips.forEach(function(blip){
        var desc = blip.description == undefined ? "" : blip.description;
        var obj = new MarkerObject(blip.name, new Coordinates(blip.x, blip.y, blip.z), MarkerTypes[blip.type], desc, "", "");
        createMarker(false, false, obj, "");
        count++;
    });
    console.log(count + " blips created");
}

var localCache = {};

function playerLeft(playerName){
    if (localCache[playerName].marker != null || localCache[playerName].marker != undefined){
        clearMarker(localCache[playerName].marker);
        localCache[playerName].marker = null;
    }
}

function doPlayerUpdate(players){
    players.forEach(function(plr){
        if (plr == null) return;

        if (plr.name in localCache){

            //console.log(JSON.stringify(plr));
            //console.log(JSON.stringify(localCache[plr.name]));

            if (plr.x == localCache[plr.name].player.x
                && plr.y == localCache[plr.name].player.y
                && plr.z == localCache[plr.name].player.z){
                    //Don't update position.. Player hasn't moved
                    console.log("Player " + plr.name + " hasn't moved");
            }else{
                console.log("updated local cache for " + plr.name);
                //console.log(JSON.stringify(plr));
                localCache[plr.name].player = plr;

                if (localCache[plr.name].marker != null || localCache[plr.name].marker != undefined){
                    //update postion
                    _MAP_markerStore[localCache[plr.name].marker].setPosition( convertToMapGMAP(plr.x, plr.y) );

                    //update popup
                    var html = '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + plr.x.toFixed(4) + "} Y {" + plr.y.toFixed(4) + "} Z {" + plr.z.toFixed(4) + "}</div>";
                    var infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-icon"></div><div class="info-header">' + plr.name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";
                    var infoBox = new google.maps.InfoWindow({
                        content: infoContent
                    });
                    _MAP_markerStore[localCache[plr.name].marker].popup.setContent(infoContent);
                }
            }

        }else{

            localCache[plr.name] = {};
            localCache[plr.name].player = plr;
            var obj = new MarkerObject(plr.name, new Coordinates(plr.x, plr.y, plr.z), MarkerTypes.normal, "A player", "", "");
            createMarker(false, false, obj, plr.name);

            localCache[plr.name].marker = _MAP_markerStore.length - 1;
        }
        });
}
