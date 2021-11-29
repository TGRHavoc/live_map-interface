import { types, nameToId } from "./markers";
import { blips as initializeBlips } from "./init";

import t from "./translator";

// eslint-disable-next-line no-unused-vars
import * as MapWrapper from "./map";
// eslint-disable-next-line no-unused-vars
import { Markers } from "./markers";

import * as L from "leaflet";

export let blipControlToggleAll = true;

/**
 * Initialises the instance of Controls
 */
export const init = () => {
    initControls();
};

export const generateBlipControls = () => {
    let container = document.getElementById("blipControlContainer");

    for (var blipName in types) {
        let a = document.createElement("a");
        a.setAttribute("data-blip-number", nameToId[blipName]);
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
        ele.onclick = blipButtonClicked;
    }

    MapWrapper.clearAllMarkers();
    MapWrapper.toggleBlips();
};

const initControls = () => {
    // let modals = document.querySelectorAll("[data-bs-toggle='modal']");
    // console.log("modals", modals);
    // modals.forEach(modalNode => new Modal(modalNode));

    document.getElementById("showBlips").onclick = showBlips_onClick;
    document.getElementById("toggleAllBlips").onclick = toggleAllBlips_onClick;
    document.getElementById("reconnect").onclick = reconnect_onClick;
    document.getElementById("serverMenu").onclick = serverMenu_onClick;

    MapWrapper.PlayerMarkers.on("cluckerclick", playerMarker_clusterClick);

    document.getElementById("playerSelect").onchange = playerSelect_onChange;
    document.getElementById("filterOn").onchange = filterOn_onChange;
    document.getElementById("refreshBlips").onclick = refreshBlips_onClick;
};

const blipButtonClicked = (ele) => {
    let blipId = ele.getAttribute("data-blip-number");
    // Toggle blip
    if (MapWrapper.disabledBlips.includes(blipId)) {
        // Already disabled, enable it
        MapWrapper.disabledBlips.splice(
            MapWrapper.disabledBlips.indexOf(blipId),
            1
        );
        ele.classList.remove("blip-disabled");
        ele.classList.add("blip-enabled");
    } else {
        // Enabled, disable it
        MapWrapper.disabledBlips.push(blipId);
        ele.classList.remove("blip-enabled");
        ele.classList.add("blip-disabled");
    }

    MapWrapper.toggleBlips();
};

const showBlips_onClick = (event) => {
    event.preventDefault();

    MapWrapper.setShowBlips(!MapWrapper.showBlips);

    //webSocket.send("getBlips");
    MapWrapper.toggleBlips();

    let ele = document.getElementById("blipsEnabled");
    ele.classList.remove("bg-success", "bg-danger");

    ele.classList.add(MapWrapper.showBlips ? "bg-success" : "bg-danger");

    let onOff = MapWrapper.showBlips ? "on" : "off";
    ele.innerText = t(`generic.${onOff}`);
};

const toggleAllBlips_onClick = () => {
    blipControlToggleAll = !blipControlToggleAll;

    let allButtons = document.getElementsByClassName("blip-button-a");

    for (let ele of allButtons) {
        let blipId = ele.getAttribute("data-blip-number");

        if (blipControlToggleAll) {
            // Showing them
            MapWrapper.disabledBlips.splice(
                MapWrapper.disabledBlips.indexOf(blipId),
                1
            );
            ele.classList.remove("blip-disabled");
            ele.classList.add("blip-enabled");
        } else {
            //Hiding them
            MapWrapper.disabledBlips.push(blipId);
            ele.classList.remove("blip-enabled");
            ele.classList.add("blip-disabled");
        }
    }

    // Now we can refresh the markers
    MapWrapper.toggleBlips();
};

const playerMarker_clusterClick = (a) => {
    const Map = MapWrapper.Map;

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
    L.DomEvent.on(html, "click", playerInsideCluster_onClick);

    Map.openPopup(html, a.layer.getLatLng());
};

const reconnect_onClick = (e) => {
    e.preventDefault();

    let connectionEle = document.getElementById("connection");

    connectionEle.classList.remove("bg-success", "bg-danger");

    connectionEle.classList.add("bg-warning");
    connectionEle.innerText = t("generic.reconnecting");

    if (
        MapWrapper.socketHandler.webSocket !== undefined ||
        MapWrapper.socketHandler.webSocket !== null
    ) {
        MapWrapper.socketHandler.webSocket.close();
    }

    MapWrapper.socketHandler.connect(MapWrapper.connectedTo.getSocketUrl());
};

const serverMenu_onClick = (e) => {
    let target = e.target;
    MapWrapper.changeServer(target.innerText);
};

export const playerMarker_onClick = (e) => {
    const Map = MapWrapper.Map;

    Map.closePopup();
    MapWrapper.PopupStore[e.target.options.id].setLatLng(e.latlng);
    Map.openPopup(MapWrapper.PopupStore[e.target.options.id]);
};

const playerInsideCluster_onClick = (e) => {
    const Map = MapWrapper.Map;

    var t = e.target;
    var attribute = t.getAttribute("data-identifier");
    var m =
        MapWrapper.PopupStore[MapWrapper.localPlayerCache[attribute].marker]; // Get the marker using the localcache.

    Map.closePopup(); //Close the currently open popup
    Map.openPopup(m); // Open the user's popup
};

const playerSelect_onChange = (e) => {
    let value = e.target.value;

    if (value === "") {
        // No longer want to track
        MapWrapper.setTrackPlayer(null);
        e.target.classList.add("text-danger");
        return;
    }

    e.target.classList.remove("text-danger");
    MapWrapper.Map.setZoom(3);
    MapWrapper.setTrackPlayer(value);
};

const filterOn_onChange = (e) => {
    const value = e.target.value;
    if (value === "") {
        MapWrapper.setFilter(undefined);
        e.target.classList.add("text-danger");
        //document.getElementById("filterOn").classList.remove("text-danger");
        return;
    }

    e.target.classList.remove("text-danger");
    MapWrapper.setFilter({
        on: value,
    });
};

const refreshBlips_onClick = (e) => {
    e.preventDefault();

    MapWrapper.clearAllMarkers();
    initializeBlips(MapWrapper.connectedTo.getBlipUrl());
};
