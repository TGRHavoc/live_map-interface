
function toggleBlips(){
	console.log("showing local blips");
	if (_showBlips){
		_blips.forEach(function(blip){
			var desc = blip.description == undefined ? "" : blip.description;
			var obj = new MarkerObject(blip.name, new Coordinates(blip.x, blip.y, blip.z), MarkerTypes[blip.type], desc, "", "");
			createMarker(false, false, obj, "");
		});
	}else{
		clearAllMarkers();
	}
}

$(document).ready(function(){
	globalInit();
	connect();

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

		$("#blips_enabled").removeClass("label-success").removeClass("label-danger")
			.addClass( _showBlips ? "label-success" : "label-danger")
			.text(_showBlips ? "on" : "off")
	});

	$("#reconnect").click(function(e){
		e.preventDefault();

		$("#connection").removeClass("label-success").removeClass("label-danger").addClass("label-warning").text("reconnecting");
		connect();
	});
});