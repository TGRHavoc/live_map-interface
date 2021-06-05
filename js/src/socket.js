import {Config} from "./config.js";
import {Alerter} from "./alerter.js";
import { MapWrapper } from "./map.js";
import { Markers } from "./markers.js";

//TODO: Document the player and blip objects
// TODO: Document the array of player objects

export class SocketHandler {
    /**
     * Creates an instance of SocketHandler.
     * @memberof SocketHandler
     */
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

        document.getElementById("playerCount").innerText = this.playerCount;
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
        document.getElementById("playerCount").textContent = self.playerCount;
    }
}

//TODO: Reimplment
// Every minute, just clear what we can "filter". In case we get one player with a unique property that is never seen again.
// setInterval(()=> {
//     window.CanFilterOn = [];
//     $("#filterOn").innerHtml = "<option></option>";
// }, 60000);
