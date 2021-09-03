import { Config } from "./config.js";
import { Alerter } from "./alerter.js";
import { MapWrapper } from "./map.js";
import { Markers } from "./markers.js";
import { Utils } from "./utils.js";

//TODO: Document the player and blip objects
// TODO: Document the array of player objects

class SocketHandler {
    /**
     * Creates an instance of SocketHandler.
     * @memberof SocketHandler
     */
    constructor() {
        this.config = Config.getConfig();
        this.webSocket = null;
        this.localPlayerCache = {};
    }

    //FIXME: We should pass a reference to mapWrapper here and call it's functions
    connect(connectionString, mapWrapper) {
        if (this.webSocket != null) { // Clean up the current websocket connection
            this.webSocket.close();
            this.webSocket = null;
        }

        this.webSocket = new WebSocket(connectionString);

        this.webSocket.onopen = this.onOpen.bind(this);

        this.webSocket.onmessage = this.onMessage.bind(this, mapWrapper);

        this.webSocket.onerror = this.onError.bind(this);

        this.webSocket.onclose = this.onClose.bind(this);
    }

    onOpen(e) {
        console.log("_isConnected: " + this.webSocket.readyState == WebSocket.OPEN);
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

        console.log("recieved message (" + byteSize / 1024 + " kB)");
        console.log("data: " + e.data);

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
            //console.log("updating players(" + typeof(data.payload) + "): " + JSON.stringify(data.payload));
            let sortedPlayers = data.payload.sort(Utils.playerNameSorter);
            //this.doPlayerUpdate(sortedPlayers);
            mapWrapper.doPlayerUpdate(sortedPlayers);

        } else if (data.type == "playerLeft") {
            //console.log("player left:" + data.payload);
            //this.playerLeft(data.payload);
            mapWrapper.playerLeft(data.payload);
        }

    }

    onError(event) {
        // TODO: Alert the user?

        new Alerter({
            title: window.Translator.t("errors.socket-error"),
            status: "error",
            autoclose: true,
            text: window.Translator.t("errors.getting-config.message", { error: { message: "There was an error with your websocket connection." } })
        });
    }

    onClose(event) {
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

export { SocketHandler };
