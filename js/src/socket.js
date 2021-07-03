import {Config} from "./config.js";
import {Alerter} from "./alerter.js";
import { MapWrapper } from "./map.js";
import { Markers } from "./markers.js";
import { Utils } from "./utils.js";

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
        this.localPlayerCache = {};
    }

    //FIXME: We should pass a reference to mapWrapper here and call it's functions
    connect(connectionString, mapWrapper){
        this.webSocket = new WebSocket(connectionString);

        this.webSocket.onopen = this.onOpen.bind(this);

        this.webSocket.onmessage = this.onMessage.bind(this, mapWrapper);

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

    /**
     *
     *
     * @param {MapWrapper} mapWrapper
     * @param {*} e
     * @memberof SocketHandler
     */
    onMessage(mapWrapper, e) {
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
            mapWrapper.addBlip(data.payload);
            // this.addBlip(data.payload);

        } else if (data.type == "removeBlip") {
            mapWrapper.removeBlip(data.payload);
            // this.removeBlip(data.payload);

        } else if (data.type == "updateBlip") {
            mapWrapper.updateBlip(data.payload);
            // this.updateBlip(data.payload);

        } else if (data.type == "playerData") {
            //Config.log("updating players(" + typeof(data.payload) + "): " + JSON.stringify(data.payload));
            let sortedPlayers = data.payload.sort(Utils.playerNameSorter);
            //this.doPlayerUpdate(sortedPlayers);
            mapWrapper.doPlayerUpdate(sortedPlayers);

        } else if (data.type == "playerLeft") {
            //Config.log("player left:" + data.payload);
            //this.playerLeft(data.payload);
            mapWrapper.playerLeft(data.payload);
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

}

//TODO: Reimplment
// Every minute, just clear what we can "filter". In case we get one player with a unique property that is never seen again.
// setInterval(()=> {
//     window.CanFilterOn = [];
//     $("#filterOn").innerHtml = "<option></option>";
// }, 60000);
