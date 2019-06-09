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

function toggleBlips(){ // _showBlips must be called before this function if you want to toggle all blips

    for (var spriteId in _blips) {
        var blipArray = _blips[spriteId];
        console._log("Disabled (" + spriteId + ")? " + _disabledBlips.includes(spriteId));

        if (_disabledBlips.indexOf(spriteId) != -1) {
            console._log("Blip " + spriteId + "'s are disabled..");

            blipArray.forEach(blip => {
                console.log(blip);
                var marker = MarkerStore[blip.markerId];
                marker.remove();
            });

            // If disabled, don't make a marker for it
            continue;
        }

        blipArray.forEach(blip => {
            //console.log(blip);
            var marker = MarkerStore[blip.markerId];
            if (_showBlips){
                marker.addTo(Map);
            }else{
                marker.remove();
            }
        });
    }
}

$(document).ready(function(){
    globalInit();

    // Toggle blip
    $("#showBlips").click(function(e){
        e.preventDefault();

        _showBlips = !_showBlips;

        //webSocket.send("getBlips");
        toggleBlips();

        $("#blips_enabled").removeClass("badge-success").removeClass("badge-danger")
            .addClass( _showBlips ? "badge-success" : "badge-danger")
            .text(_showBlips ? "on" : "off");
    });

    $("#toggle-all-blips").on("click", function () {
        _blipControlToggleAll = !_blipControlToggleAll;
        console._log(_blipControlToggleAll + " showing blips?");
        // Toggle the classes and add/remove the blipIds from the array

        $("#blip-control-container").find("a").each(function (index, ele) {
            var ele = $(ele);
            var blipId = ele.data("blip-number").toString();

            if (_blipControlToggleAll) {
                // Showing them
                _disabledBlips.splice(_disabledBlips.indexOf(blipId), 1);
                ele.removeClass("blip-disabled").addClass("blip-enabled");
            } else {
                // Hiding them all
                _disabledBlips.push(blipId);
                ele.removeClass("blip-enabled").addClass("blip-disabled");
            }
        });

        // Now we can refresh the markers
        toggleBlips();
    });


    $("#playerSelect").on("change", function(){
        if (this.value == ""){
            _trackPlayer = null;
            return;
        }

        Map.setZoom(3);// zoom in!
        _trackPlayer = this.value;
    });

    $("#filterOn").on("change", function(){
        if (this.value == ""){
            window.Filter = undefined;
            return;
        }

        window.Filter = {
            on: this.value
        }
    });

    $("#refreshBlips").click(function(e){
        e.preventDefault();

        clearAllMarkers();
        initBlips(connectedTo.getBlipUrl());
    });

    $("#server_menu").on("click", ".serverMenuItem", function(e){
        console._log($(this).text());
        changeServer($(this).text());
    });

    $("#reconnect").click(function(e){
        e.preventDefault();

        $("#connection").removeClass("badge-success").removeClass("badge-danger").addClass("badge-warning").text("reconnecting");

        if(webSocket != undefined || webSocket != null){
            webSocket.close();
        }

        connect();
    });
});

function initMapControl(Map){
    // When a layer changes. Recalculate everything and shit. Make sure nothing breaks.
    Map.on("baselayerchange", function (e) {

        var mapBounds = getMapBounds(e.layer);

        Map.setMaxBounds(mapBounds);
        Map.fitBounds(mapBounds);
        CurrentLayer = e.layer;

        clearAllMarkers();
        toggleBlips();
    });
}

function initPlayerMarkerControls(Map, PlayerMarkers){

    // If they click on a clustered marker
    PlayerMarkers.on('clusterclick', function (a) {

        var html = L.DomUtil.create('ul');
        var markers = a.layer.getAllChildMarkers();
        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i].options;

            var name = marker.title;
            var child = L.DomUtil.create("li", "clusteredPlayerMarker");
            child.setAttribute("data-identifier", marker.player.identifier);
            child.appendChild(document.createTextNode(name));

            html.appendChild(child);
        }

        L.DomEvent.on(html, "click", function(e){
            var t = e.target;
            var attribute = t.getAttribute("data-identifier");
            var m = PopupStore[localCache[attribute].marker]; // Get the marker using the localcache.

            Map.closePopup(Map._popup); //Close the currently open popup
            Map.openPopup(m); // Open the user's popup
        });

        Map.openPopup(html, a.layer.getLatLng());
    });
}
