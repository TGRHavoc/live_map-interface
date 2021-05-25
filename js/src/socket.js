import {Config} from "./config.js";
import {Alerter} from "./alerter.js";

export class SocketHandler {
    constructor(){
        this.config = Config.getConfig();
        this.webSocket = null;
        this.localCache = {};
    }

    connect(connectionString){
        this.webSocket = new WebSocket(connectionString);

        this.webSocket.onopen = this.onOpen.bind(this);

        this.webSocket.onmessage = this.onMessage.bind(this);

        this.webSocket.onerror = this.onError.bind(this);

        this.webSocket.onclose = this.onClose.bind(this);

    }

    onOpen(e) {
        Config.log("_isConnected: " + this.webSocket.readyState == WebSocket.OPEN);
        let conn = document.getElementById("connection");

        conn.classList.remove("bg-danger", "bg-warning");
        conn.classList.add("bg-success");
        conn.textContent = window.Translator.t("generic.connected");

        //document.getElementById("socket_error").textContent = "";
    }

    sorter(plr1, plr2) {
        let str1 = plr1.name;
        let str2 = plr2.name;

        return (str1 < str2) ? -1 : (str1 > str2) ? 1 : 0;
    }

    onMessage(e) {
        let m = encodeURIComponent(e.data).match(/%[89ABab]/g);
        let byteSize = e.data.length + (m ? m.length : 0);

        Config.log("recieved message (" + byteSize / 1024 + " kB)");
        Config.log("data: " + e.data);

        let data = JSON.parse(e.data);

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
            this.addBlip(data.payload);

        } else if (data.type == "removeBlip") {
            this.removeBlip(data.payload);

        } else if (data.type == "updateBlip") {
            this.updateBlip(data.payload);

        } else if (data.type == "playerData") {
            //Config.log("updating players(" + typeof(data.payload) + "): " + JSON.stringify(data.payload));
            let sortedPlayers = data.payload.sort(this.sorter);
            this.doPlayerUpdate(sortedPlayers);

        } else if (data.type == "playerLeft") {
            //Config.log("player left:" + data.payload);
            this.playerLeft(data.payload);
        }

    }

    onError(event) {
        // TODO: Alert the user?
    }

    onClose(event) {
        // from http://stackoverflow.com/a/28396165
        let reason;
        // See http://tools.ietf.org/html/rfc6455#section-7.4.1
        if (event.code >= 1000 && event.code <= 1015) {
            console.warn(event.code);
            reason = window.Translator.t(`errors.socket.${event.code}`, event);
        } else {
            reason = window.Translator.t(`errors.socket.other`, event);
        }

        //$("#socket_error").text(reason);
        // console.error("Socket error: " + reason);
        new Alerter({
            title: window.Translator.t("errors.socket-error"),
            status: "error",
            autoclose: false,
            text: `${reason}`
        });

        let conn = document.getElementById("connection");

        conn.classList.remove("bg-success", "bg-warning");
        conn.classList.add("bg-danger");
        conn.textContent = window.Translator.t("generic.disconnected");
    }

    //TODO: Refactor
    doesBlipExist(blip) {
        // if (_blips[blip.type] == null) {
        //     return false;
        // }

        // let blipArrayForType = _blips[blip.type];

        // for (let b in blipArrayForType) {
        //     let blp = blipArrayForType[b];

        //     if (blp.pos.x == blip.pos.x && blp.pos.y == blip.pos.y && blp.pos.z == blip.pos.z) {
        //         return true;
        //     }
        // }

        return false;
    }
    //TODO: Refactor
    addBlip(blipObj) {
        // if (doesBlipExist(blipObj)) {
        //     return; // Meh, it already exists.. Just don't add it
        // }

        // if (!blipObj.hasOwnProperty("name")) { // Doesn't have a name
        //     if (MarkerTypes[spriteId] == null || MarkerTypes[spriteId].name == undefined) {
        //         // No stored name, make one up
        //         blipObj.name = "Dynamic Marker";
        //     } else {
        //         blipObj.name = MarkerTypes[spriteId].name;
        //     }
        // }

        // if (!blipObj.hasOwnProperty("description")) { // Doesn't have a description
        //     blipObj.description = "";
        // }

        // createBlip(blipObj);
    }
    //TODO: Refactor
    removeBlip(blipObj) {
        // if (doesBlipExist(blipObj)) {
        //     // Remove it

        //     let markerId = getBlipMarkerId(blipObj);
        //     let index = getBlipIndex(blipObj);
        //     clearMarker(markerId);

        //     _blips[blipObj.type].splice(index, 1);

        //     if (_blips[blipObj.type].length == 0) {
        //         delete _blips[blipObj.type];
        //     }

        //     _blipCount--;
        //     $("#blip_count").text(_blipCount);
        //     document.getElementById("blip_count").textContent = _blipCount;
        // }
    }
    //TODO: Refactor
    updateBlip(blipObj) {
        // if (doesBlipExist(blipObj)) {
        //     // Can update it
        //     let markerId = getBlipMarkerId(blipObj);
        //     let blipIndex = getBlipIndex(blipObj);

        //     let marker = _MAP_markerStore[markerId];

        //     if (blipObj.hasOwnProperty("new_pos")) {
        //         // Blips are supposed to be static so, why this would even be fucking needed it beyond me
        //         // Still, better to prepare for the inevitability that someone wants this fucking feature
        //         marker.setLatLng(convertToMap(blipObj.new_pos.x, blipObj.new_pos.y, blipObj.new_pos.z));
        //         blipObj.pos = blipObj.new_pos;
        //         delete blipObj.new_pos;
        //     }

        //     let name = "No name blip..";
        //     let html = "";

        //     if (blipObj.hasOwnProperty("name")) {
        //         name = blipObj.name;
        //     } else {
        //         // No name given, might as well use the default one... If it exists...
        //         if (MarkerTypes[blipObj.type] != undefined && MarkerTypes[blipObj.type].name != undefined) {
        //             name = MarkerTypes[blipObj.type].name;
        //         }
        //     }

        //     for (let key in blipObj) {

        //         if (key == "name" || key == "type") {
        //             continue; // Name is already shown
        //         }

        //         if (key == "pos") {
        //             html += '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + blipObj.pos.x.toFixed(2) + "} Y {" + blipObj.pos.y.toFixed(2) + "} Z {" + blipObj.pos.z.toFixed(2) + "}</div>";
        //         } else {
        //             // Make sure the first letter of the key is capitalised
        //             key[0] = key[0].toUpperCase();
        //             html += '<div class="row info-body-row"><strong>' + key + ":</strong>&nbsp;" + blipObj[key] + "</div>";
        //         }
        //     }

        //     let info = '<div class="info-window"><div class="info-header-box"><div class="info-header">' + name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";

        //     marker.unbindPopup();
        //     marker.bindPopup(info);

        //     _blips[blipObj.type][blipIndex] = blipObj;
        // }
    }

    playerLeft(playerName) {
        if (this.localCache[playerName] !== undefined &&
                (this.localCache[playerName].marker != null || this.localCache[playerName].marker != undefined)) {
            //clearMarker(localCache[playerName].marker);
            delete this.localCache[playerName];
        }

        if ($("#playerSelect option[value='" + playerName + "']").length > 0) {
            $("#playerSelect option[value='" + playerName + "']").remove();
        }

        this.playerCount = Object.keys(this.localCache).length;

        Config.log("Playerleft playercount: " + this.playerCount);

        document.getElementById("player_count").innerText = this.playerCount;
    }

    getPlayerInfoHtml(plr) {
        //FIXME: Add Translation
        let html = '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + plr.pos.x.toFixed(0) + "} Y {" + plr.pos.y.toFixed(0) + "} Z {" + plr.pos.z.toFixed(0) + "}</div>";
        for (let key in plr) {
            //Config.log("found key: "+ key);
            if (key == "name" || key == "pos" || key == "icon") { // I should probably turn this into a array or something
                continue; // We're already displaying this info
            }

            if (key !== "identifier") {
                html += '<div class="row info-body-row"><strong>' + key + ':</strong>&nbsp;' + plr[key] + '</div>';
            } else if (this.config.showIdentifiers && key == "identifier") {
                html += '<div class="row info-body-row"><strong>identifier:</strong>&nbsp;' + plr[key] + '</div>';
            } else {
                continue;
            }
        }
        return html;
    }

    getFilterProps(plr){
        let props = [];
        for (let key in plr) {
            //Config.log("found key: "+ key);
            if (key == "name" || key == "pos" || key == "icon") { // I should probably turn this into a array or something
                continue; // We're already displaying this info
            }

            if (key !== "identifier") {
                props.push(key);
            } else if (this.config.showIdentifiers && key == "identifier") {
                props.push(key);
            } else {
                continue;
            }
        }

        return props;
    }

    doPlayerUpdate(players) {

        Config.log(players);
        const self = this;
        players.forEach(function (plr) {
            if (plr == null || plr.name == undefined || plr.name == "") return;
            if (plr.identifier == undefined || plr.identifier == "") return;

            if (!(plr.identifier in self.localCache)) {
                self.localCache[plr.identifier] = { marker: null, lastHtml: null };
            }

            // Filtering stuff

            // If this player has a new property attached to them that we haven't seen before, add it to the filer
            let p = self.getFilterProps(plr);
            p.forEach((_p) => {
                // if (!window.CanFilterOn.includes(_p)){
                //     window.CanFilterOn.push(_p);
                //     $("#filterOn").append(`<option value="${_p}">${_p}</option>`);
                // }
            });

            let opacity = 1.0;
            // if (window.Filter != undefined){
            //     if (plr[window.Filter.on] == undefined) {
            //         opacity = 0.0;
            //     }else{
            //         let value = $("#onlyShow").val();
            //         if (value != "" && !plr[window.Filter.on].includes(value)){
            //             opacity = 0.0;
            //         }
            //     }
            // }

            let selectPlayerOptions = document.getElementById("playerSelect").options;
            if (!(plr.identifier in selectPlayerOptions)) {
                // TODO: Implement
                // $("#playerSelect").append($("<option>", {
                //     value: plr.identifier, // Should be unique
                //     text: plr.name // Their name.. Might not be unique?
                // }));
            }
            // TODO: Implement
            // if (_trackPlayer != null && _trackPlayer == plr.identifier) {
            //     // If we're tracking a player, make sure we center them
            //     Map.panTo(convertToMap(plr.pos.x, plr.pos.y));
            // }

            if (self.localCache[plr.identifier].marker != null || self.localCache[plr.identifier].marker != undefined) {
                // If we have a custom icon (we should) use it!!
                if (plr.icon) {
                    let t = window.markers.MarkerTypes[plr.icon];

                    //Config.log("Got icon of :" + plr.icon);
                    // TODO: Implement
                    // MarkerStore[self.localCache[plr.identifier].marker].setIcon(L.icon(t));
                }

                // Update the player's location on the map :)
                // TODO: Implement
                //MarkerStore[localCache[plr.identifier].marker].setLatLng(convertToMapLeaflet(plr.pos.x, plr.pos.y));

                //update popup with the information we have been sent
                let html = self.getPlayerInfoHtml(plr);

                let infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-header">' + plr.name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";

                let m = self.localCache[plr.identifier].marker;
                // TODO: Implement
                // let marker = MarkerStore[m];
                // let popup = PopupStore[m];

                // marker.setOpacity(opacity);

                // if (infoContent != localCache[plr.identifier].lastHtml){
                //     popup.setContent(infoContent);
                //     localCache[plr.identifier].lastHtml = infoContent;
                // }

                // if(popup.isOpen()){
                //     if (popup.getLatLng().distanceTo(marker.getLatLng()) != 0){
                //         popup.setLatLng(marker.getLatLng());
                //     }
                // }


            } else {
                let html = self.getPlayerInfoHtml(plr);
                let infoContent = '<div class="info-window"><div class="info-header-box"><div class="info-icon"></div><div class="info-header">' + plr.name + '</div></div><div class="clear"></div><div id=info-body>' + html + "</div></div>";
                self.localCache[plr.identifier].lastHtml = infoContent;

                let obj = new MarkerObject(plr.name, new Coordinates(plr.pos.x, plr.pos.y, plr.pos.z), window.markers.MarkerTypes[6], "", {isPlayer: true, player: plr});
                // TODO: Implement
                // let m = localCache[plr.identifier].marker = createMarker(false, false, obj, plr.name) - 1;

                // MarkerStore[m].unbindPopup(); // We want to handle the popups ourselfs.
                // MarkerStore[m].setOpacity(opacity);

                // PopupStore[m] = L.popup()
                //     .setContent(infoContent)
                //     .setLatLng(MarkerStore[m].getLatLng()); // Make a new marker

                // MarkerStore[m].on("click", function(e) {
                //     Config.log(e);
                //     Map.closePopup(Map._popup);
                //     PopupStore[e.target.options.id].setLatLng(e.latlng);
                //     Map.openPopup(PopupStore[e.target.options.id]);
                // });
            }
        });

        self.playerCount = Object.keys(self.localCache).length;

        Config.log("playercount: " + self.playerCount);
        document.getElementById("player_count").textContent = self.playerCount;
    }
}

//TODO: Reimplment
// Every minute, just clear what we can "filter". In case we get one player with a unique property that is never seen again.
// setInterval(()=> {
//     window.CanFilterOn = [];
//     $("#filterOn").innerHtml = "<option></option>";
// }, 60000);
