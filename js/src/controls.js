import { MapWrapper } from "./map.js";
import { types } from "./markers.js";
import { Initializer } from "./init.js";

class Controls {

    /**
     * Creates an instance of Controls.
     * @param {MapWrapper} mapWrapper
     * @memberof Controls
     */
    constructor(mapWrapper) {
        this.mapWrapper = mapWrapper;

        this.blipControlToggleAll = true;

        this.initControls();
    }

    initControls() {
        document.getElementById("showBlips").onclick = this.showBlips_onClick.bind(this);
        document.getElementById("toggleAllBlips").onclick = this.toggleAllBlips_onClick.bind(this);
        document.getElementById("reconnect").onclick = this.reconnect_onClick.bind(this);
        document.getElementById("serverMenu").onclick = this.serverMenu_onClick.bind(this);

        this.mapWrapper.PlayerMarkers.on("cluckerclick", this.playerMarker_clusterClick.bind(this));

        document.getElementById("playerSelect").onchange = this.playerSelect_onChange.bind(this);
        document.getElementById("filterOn").onchange = this.filterOn_onChange.bind(this);
        document.getElementById("refreshBlips").onclick = this.refreshBlips_onClick.bind(this);

    }

    /**
     *
     * @param {Markers} markers
     * @memberof Controls
     */
    generateBlipControls(markers) {
        let container = document.getElementById("blipControlContainer");

        for (var blipName in types) {
            let a = document.createElement("a");
            a.setAttribute("data-blip-number", markers.nameToId[blipName]);
            a.id = `blip_${blipName}_link`;
            a.classList.add("blip-button-a", "d-inline-block", "blip-enabled");
            let span = document.createElement("span");
            span.classList.add("blip", `blip-${blipName}`);

            a.appendChild(span);

            container.appendChild(a);

            console.log("Added ahref for " + blipName);
        }

        var allButtons = document.getElementsByClassName("blip-button-a");

        for (let ele of allButtons) {
            ele.onclick = this.blipButtonClicked.bind(this, ele);
        }

        this.mapWrapper.clearAllMarkers();
        this.mapWrapper.toggleBlips();
    }

    blipButtonClicked(ele) {
        let blipId = ele.getAttribute("data-blip-number");
        // Toggle blip
        if (this.mapWrapper.disabledBlips.includes(blipId)) {
            // Already disabled, enable it
            this.mapWrapper.disabledBlips.splice(this.mapWrapper.disabledBlips.indexOf(blipId), 1);
            ele.classList.remove("blip-disabled");
            ele.classList.add("blip-enabled");
        } else {
            // Enabled, disable it
            this.mapWrapper.disabledBlips.push(blipId);
            ele.classList.remove("blip-enabled");
            ele.classList.add("blip-disabled");
        }

        this.mapWrapper.toggleBlips();
    }

    showBlips_onClick(event) {
        const lang = window.Translator;

        event.preventDefault();

        this.mapWrapper.showBlips = !this.mapWrapper.showBlips;

        //webSocket.send("getBlips");
        this.mapWrapper.toggleBlips();

        let ele = document.getElementById("blipsEnabled");
        ele.classList.remove("bg-success", "bg-danger");

        ele.classList.add(this.mapWrapper.showBlips ? "bg-success" : "bg-danger");

        let onOff = this.mapWrapper.showBlips ? "on" : "off";
        ele.innerText = lang.t(`generic.${onOff}`);
    }

    toggleAllBlips_onClick(event) {

        this.blipControlToggleAll = !this.blipControlToggleAll;


        let allButtons = document.getElementsByClassName("blip-button-a");

        for (let ele of allButtons) {
            let blipId = ele.getAttribute("data-blip-number");

            if (this.blipControlToggleAll) {
                // Showing them
                this.mapWrapper.disabledBlips.splice(this.mapWrapper.disabledBlips.indexOf(blipId), 1);
                ele.classList.remove("blip-disabled");
                ele.classList.add("blip-enabled");

            } else {
                //Hiding them
                this.mapWrapper.disabledBlips.push(blipId);
                ele.classList.remove("blip-enabled");
                ele.classList.add("blip-disabled");

            }
        }

        // Now we can refresh the markers
        this.mapWrapper.toggleBlips();

    }

    playerMarker_clusterClick(a) {
        const Map = this.mapWrapper.Map;

        var html = L.DomUtil.create("ul");
        var markers = a.layer.getAllChildMarkers();
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i].options;

            var name = marker.title;
            var child = L.DomUtil.create("li", "clusteredPlayerMarker");
            child.setAttribute("data-identifier", marker.player.identifier);
            child.appendChild(document.createTextNode(name));

            html.appendChild(child);
        }

        // If they click on a username
        L.DomEvent.on(html, "click", this.playerInsideCluster_onClick.bind(this));

        Map.openPopup(html, a.layer.getLatLng());
    }

    playerInsideCluster_onClick(e) {
        var t = e.target;
        var attribute = t.getAttribute("data-identifier");
        var m = this.mapWrapper.PopupStore[this.mapWrapper.localCache[attribute].marker]; // Get the marker using the localcache.

        Map.closePopup(Map._popup); //Close the currently open popup
        Map.openPopup(m); // Open the user's popup
    }

    reconnect_onClick(e) {

        e.preventDefault();

        const lang = window.Translator;
        let connectionEle = document.getElementById("connection");

        connectionEle.classList.remove("bg-success", "bg-danger");

        connectionEle.classList.add("bg-warning");
        connectionEle.innerText = lang.t("generic.reconnecting");



        if (this.mapWrapper.socketHandler.webSocket != undefined || this.mapWrapper.socketHandler.webSocket != null) {
            this.mapWrapper.socketHandler.webSocket.close();
        }

        this.mapWrapper.socketHandler.connect(this.mapWrapper.connectedTo.getSocketUrl());
    }

    serverMenu_onClick(e) {
        let target = e.target;
        this.mapWrapper.changeServer(target.innerText);
    }

    playerMarker_onClick(mw, e) {
        mw.Map.closePopup(mw.Map._popup);
        mw.PopupStore[e.target.options.id].setLatLng(e.latlng);
        mw.Map.openPopup(mw.PopupStore[e.target.options.id]);
    }

    playerSelect_onChange(e) {
        let value = e.target.value;

        if (value == "") { // No longer want to track
            this.mapWrapper.trackPlayer = null;
            e.target.classList.add("text-danger");
            return;
        }

        e.target.classList.remove("text-danger");
        this.mapWrapper.Map.setZoom(3);
        this.mapWrapper.trackPlayer = value;
    }

    filterOn_onChange(e) {
        const value = e.target.value;
        if (value == "") {
            this.mapWrapper.Filter = undefined;
            e.target.classList.add("text-danger");
            //document.getElementById("filterOn").classList.remove("text-danger");
            return;
        }

        e.target.classList.remove("text-danger");
        this.mapWrapper.Filter = {
            on: value
        };
    }

    refreshBlips_onClick(e) {
        e.preventDefault();

        this.mapWrapper.clearAllMarkers();
        Initializer.blips(this.mapWrapper.connectedTo.getBlipUrl(), this.mapWrapper.markers, this.mapWrapper);
    }
}


export { Controls };
