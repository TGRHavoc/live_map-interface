function toggleBlips(){if(clearAllMarkers(),_showBlips)for(var e in _blips){var l=_blips[e];if(console._log("Disabled ("+e+")? "+_disabledBlips.includes(e)),-1==_disabledBlips.indexOf(e))for(var t in l){var o=l[t],n=new MarkerObject(o.name,new Coordinates(o.pos.x,o.pos.y,o.pos.z),MarkerTypes[o.type],o.description,"","");o.markerId=createMarker(!1,!1,n,"")-1}else console._log("Blip "+e+"'s are disabled..")}}function initMapControl(e){e.on("baselayerchange",function(l){var t=getMapBounds(l.layer);e.setMaxBounds(t),e.fitBounds(t),CurrentLayer=l.layer,clearAllMarkers(),toggleBlips()})}function initPlayerMarkerControls(e,l){l.on("clusterclick",function(l){for(var t=L.DomUtil.create("ul"),o=l.layer.getAllChildMarkers(),n=0;n<o.length;n++){var a=o[n].options,r=a.title,s=L.DomUtil.create("li","clusteredPlayerMarker");s.setAttribute("data-identifier",a.player.identifer),s.appendChild(document.createTextNode(r)),t.appendChild(s)}L.DomEvent.on(t,"click",function(l){var t=l.target.getAttribute("data-identifier"),o=MarkerStore[localCache[t].marker];e.closePopup(e._popup),e.openPopup(o.getPopup())}),e.openPopup(t,l.layer.getLatLng())})}$(document).ready(function(){globalInit(),$("#showBlips").click(function(e){e.preventDefault(),_showBlips=!_showBlips,toggleBlips(),$("#blips_enabled").removeClass("badge-success").removeClass("badge-danger").addClass(_showBlips?"badge-success":"badge-danger").text(_showBlips?"on":"off")}),$("#playerSelect").on("change",function(){""!=this.value?(Map.setZoom(3),_trackPlayer=this.value):_trackPlayer=null}),$("#refreshBlips").click(function(e){e.preventDefault(),clearAllMarkers(),initBlips(connectedTo.getBlipUrl())}),$("#server_menu").on("click",".serverMenuItem",function(e){console._log($(this).text()),changeServer($(this).text())}),$("#reconnect").click(function(e){e.preventDefault(),$("#connection").removeClass("badge-success").removeClass("badge-danger").addClass("badge-warning").text("reconnecting"),null==webSocket&&null==webSocket||webSocket.close(),connect()}),$("#toggle-all-blips").on("click",function(){_blipControlToggleAll=!_blipControlToggleAll,console._log(_blipControlToggleAll+" showing blips?"),$("#blip-control-container").find("a").each(function(e,l){var t=(l=$(l)).data("blip-number").toString();_blipControlToggleAll?(_disabledBlips.splice(_disabledBlips.indexOf(t),1),l.removeClass("blip-disabled").addClass("blip-enabled")):(_disabledBlips.push(t),l.removeClass("blip-enabled").addClass("blip-disabled"))}),toggleBlips()})}),$(document).ready(function(){$.ajax("version.json",{error:function(e,l){createAlert({title:"<strong>Error getting version.json!</strong>",message:e.statusText})},dataType:"text",success:function(e,l){var t=stripJsonOfComments(e),o=JSON.parse(t);window.version=o.interface,$("#livemap_version").text(window.version),$.ajax("//raw.githubusercontent.com/TGRHavoc/live_map-interface/master/version.json",{error:function(e,l){createAlert({title:"<strong>Error latest version for check!</strong>",message:e.statusText})},dataType:"text",success:function(e,l){var t=stripJsonOfComments(e),o=JSON.parse(t);window.compareVersions(window.version,o.interface)<0?createAlert({title:"Update available",message:`An update is available (${window.version} -> ${o.interface}). Please download it <a style='color: #000;' href='https://github.com/TGRHavoc/live_map-interface'>HERE.</a>`}):console._log("Up to date or, a higher version")}})}})});