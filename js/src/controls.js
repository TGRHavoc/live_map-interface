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

function toggleBlips(){
    console.log("showing local blips");
    if (_showBlips){

        for(var spriteId in _blips){
            var blipArray = _blips[spriteId];
            //console.log("Disabled (" + spriteId + ")? " + _disabledBlips.includes(spriteId));

            if(_disabledBlips.indexOf(spriteId) != -1){
                if(_SETTINGS_debug){
                    console.log("Blip " + spriteId + "'s are disabled..");
                }
                // If disabled, don't make a marker for it
                continue;
            }

            for(var i in blipArray){
                var blip = blipArray[i];

                var obj = new MarkerObject(blip.name, new Coordinates(blip.pos.x, blip.pos.y, blip.pos.z), MarkerTypes[blip.type], blip.description, "", "");
                blip.markerId = createMarker(false, false, obj, "") - 1;
            }
        }

    }else{
        clearAllMarkers();
    }
}

$(document).ready(function(){
    globalInit();
    connect();


    $("#overlaySelect").on("change", function(){
        if(this.value == -1){
            map.overlayMapTypes.setAt(0,null);
        }else{
            if(_overlays[this.value] != undefined){
                map.overlayMapTypes.setAt(0, _overlays[this.value]);
            }
        }
    });

    $("#playerSelect").on("change", function(){
        if (this.value == ""){
            _trackPlayer = null;
            return;
        }

        map.setZoom(7);// zoom in!
        _trackPlayer = this.value;
    });

    $("#refreshBlips").click(function(e){
        e.preventDefault();
        if (_showBlips){
            clearAllMarkers();
            initBlips();
        }
    });

    $("#showBlips").click(function(e){
        e.preventDefault();

        _showBlips = !_showBlips;

        //webSocket.send("getBlips");
        toggleBlips();

        $("#blips_enabled").removeClass("badge-success").removeClass("badge-danger")
            .addClass( _showBlips ? "badge-success" : "badge-danger")
            .text(_showBlips ? "on" : "off");
    });

    $("#reconnect").click(function(e){
        e.preventDefault();

        $("#connection").removeClass("badge-success").removeClass("badge-danger").addClass("badge-warning").text("reconnecting");

        if(webSocket != undefined || webSocket != null){
            webSocket.close();
        }

        connect();
    });

    $("#toggle-all-blips").on("click", function(){
        // Toggle the classes and add/remove the blipIds from the array
        $("#blip-control-container").find("a").each(function(index, ele){
            var ele = $(ele);
            var blipId = ele.data("blipNumber").toString();

            // Toggle blip
            if(_disabledBlips.includes(blipId)){
                // Already disabled, enable it
                _disabledBlips.splice(_disabledBlips.indexOf(blipId), 1);
                ele.removeClass("blip-disabled").addClass("blip-enabled");
            }else{
                // Enabled, disable it
                _disabledBlips.push(blipId);
                ele.removeClass("blip-enabled").addClass("blip-disabled");
            }
        });

        // Now we can refresh the markers
        clearAllMarkers();
        toggleBlips();
    });

});
