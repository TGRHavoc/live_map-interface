// ************************************************************************** //
//			LiveMap Interface - The web interface for the livemap
//					Copyright (C) 2017  Jordan Dalton
//
//	  This program is free software: you can redistribute it and/or modify
//	  it under the terms of the GNU General Public License as published by
//	  the Free Software Foundation, either version 3 of the License, or
//	  (at your option) any later version.
//
//	  This program is distributed in the hope that it will be useful,
//	  but WITHOUT ANY WARRANTY; without even the implied warranty of
//	  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//	  GNU General Public License for more details.
//
//	  You should have received a copy of the GNU General Public License
//	  along with this program in the file "LICENSE".  If not, see <http://www.gnu.org/licenses/>.
// ************************************************************************** //

var _invervalId;
var _isLive = false;
var _blips = [];
var _blipCount = 0;
var _showBlips = true;
var _isConnected = false;
var _trackPlayer = null;
var playerCount = 0;

function globalInit() {
	mapInit("map-canvas");
	initPage();
	initBlips();
}

function initPage() {
	$(window).on("load resize", function() {
		$(".map-tab-content").height((($("#tab-content").height() - $(".page-title-1").height()) - ($("#map-overlay-global-controls").height() * 4.2)));
	});
}

function createBlip(blip){
	var obj = new MarkerObject(blip.name, new Coordinates(blip.x, blip.y, blip.z), MarkerTypes[blip.type], blip.description, "", "");

	_blips[_blipCount++] = blip;

	createMarker(false, false, obj, "");
}

function blipSuccess(data, textStatus){
	if (data.error){
		//Do something about the error i guess.
		console.error("Error: " + data.error);
		return;
	}

	for (var spriteId in data) {
		if (data.hasOwnProperty(spriteId)) {
			// data[spriteId] == array of blips for that type
			var blipArray = data[spriteId];

			for (var i in blipArray) {
				var blip = blipArray[i];
				blip.name = (blip.hasOwnProperty("name") || blip.name != undefined) ? blip.name : MarkerTypes[spriteId].name;
				blip.description = (blip.hasOwnProperty("description") || blip.description != undefined) ? blip.description : "";

				blip.type = spriteId;

				createBlip(blip);
			}
		}
	}

	console.log(_blipCount + " blips created");
	$("#blip_count").text(_blipCount);

}

function blipError( textStatus, errorThrown){
	console.error("Error \"" + textStatus + "\": " + errorThrown);
}

function initBlips(){
	_blipCount = 0;
	_blips = [];

	console.log("Sending ajax request to " + _SETTINGS_blipUrl);
	$.ajax(_SETTINGS_blipUrl, {
		error: blipError,
		dataType: "json",
		success: blipSuccess
	});
}

function initMarkers(debugOnly) {
	if (debugOnly) {
		createMarker(false, true, new MarkerObject("@DEBUG@@Locator", new Coordinates(0, 500, 0), MarkerTypes[999], "", ""), "");
		console.log("MarkerType: " + MarkerTypes[999]);
	} else {
		createMarker(false, false, new MarkerObject("True Map Center", new Coordinates(0, 0, 0), MarkerTypes[6], "", ""), "");
	}
}
