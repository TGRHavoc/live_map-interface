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

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n)
}
function normalize(value, min, max) {
    return Math.abs((value - min) / (max - min));
}

var game_1_x = 327.86;
var game_1_y = 1660.16;

var game_2_x = -3778.16;
var game_2_y = -4549.6;


var game_min_x = -4000.00;
var game_max_x = 6000.00;
var game_min_y = 8000.00;
var game_max_y = -4000.00;
var map_min_x = 0;
var map_min_y = 0;

/*
    var rLng = map_1_lng + (x - game_1_x) * (map_1_lng - map_2_lng) / (game_1_x - game_2_x);
    var rLat = map_1_lat + (y - game_1_y) * (map_1_lat - map_2_lat) / (game_1_y - game_2_y);
*/
function convertToMap(x, y) {
    var h = _MAP_currentLayer.options.tileSize * 3,
        w = _MAP_currentLayer.options.tileSize * 2;

    var latLng1 = _MAP_map.unproject([w * 0.5, h * 0.5], _MAP_map.getMaxZoom());
    var latLng2 = _MAP_map.unproject([0, h], _MAP_map.getMaxZoom());

    var rLng = latLng1.lng + (x - game_1_x) * (latLng1.lng - latLng2.lng) / (game_1_x - game_2_x);
    var rLat = latLng1.lat + (y - game_1_y) * (latLng1.lat - latLng2.lat) / (game_1_y - game_2_y);
    return result = {
        lat: rLat,
        lng: rLng
    };
}

function convertToMapOld(x, y) {
    var map_max_x = _MAP_currentLayer.options.tileSize * 2,
        map_max_y = _MAP_currentLayer.options.tileSize * 3;

    var xPercent = normalize(x, game_min_x, game_max_x);
    var destX = xPercent * (Math.abs(map_max_x - map_min_x)) + map_min_x;

    var yPercent = normalize(y, game_min_y, game_max_y);
    var destY = yPercent * (Math.abs(map_max_y - map_min_y)) + map_min_y;

    console.log(convertToMap(x,y));
    console.log(_MAP_map.unproject([destX, destY], _MAP_map.getMaxZoom()));
    return _MAP_map.unproject([destX, destY], _MAP_map.getMaxZoom());
}

function convertToMapLeaflet(x, y){
    var t = convertToMap(x, y);
    return t;
}

function stringCoordToFloat(coord) {
    return result = {
        x: parseFloat(coord.x),
        y: parseFloat(coord.y),
        z: parseFloat(coord.z),
    };
};
