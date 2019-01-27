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
var game_min_x = -4000;
var game_max_x = 6000;

var game_min_y = 8000;
var game_max_y = -4000;

var map_min_x = 0;
var map_max_x = 2048*2 + 1024;

var map_min_y = 0;
var map_max_y = 2048*3 - 256;

function normalize(value, min, max){
    return Math.abs((value - min) / (max - min));
}

function convertToMap(x, y) {
    var xPercent = normalize(x, game_min_x, game_max_x);
    var destX = xPercent * (Math.abs(map_max_x - map_min_x)) + map_min_x;

    var yPercent = normalize(y, game_min_y, game_max_y);
    var destY = yPercent * (Math.abs(map_max_y - map_min_y)) + map_min_y;

    return {lat: destX, lng: destY};
}

function convertToMapLeaflet(x, y){
    var xPercent = normalize(x, game_min_x, game_max_x);
    var destX = xPercent * (Math.abs(map_max_x - map_min_x)) + map_min_x;

    var yPercent = normalize(y, game_min_y, game_max_y);
    var destY = yPercent * (Math.abs(map_max_y - map_min_y)) + map_min_y;

    return _MAP_map.unproject([destX, destY], _MAP_map.getMaxZoom());
}

function convertToGame(lat, lng) {
    var rX = game_1_x + (lng - map_1_lng) * (game_1_x - game_2_x) / (map_1_lng - map_2_lng);
    var rY = game_1_y + (lat - map_1_lat) * (game_1_y - game_2_y) / (map_1_lat - map_2_lat);
    return result = {
        x: rX,
        y: rY
    };
}

function convertToGameCoord(lat, lng) {
    var rX = game_1_x + (lng - map_1_lng) * (game_1_x - game_2_x) / (map_1_lng - map_2_lng);
    var rY = game_1_y + (lat - map_1_lat) * (game_1_y - game_2_y) / (map_1_lat - map_2_lat);
    return result = {
        x: rX,
        y: rY,
        z: 0
    };
}

function convertToMap_OLD(x, y) {
    var rLng = map_1_lng + (x - game_1_x) * (map_1_lng - map_2_lng) / (game_1_x - game_2_x);
    var rLat = map_1_lat + (y - game_1_y) * (map_1_lat - map_2_lat) / (game_1_y - game_2_y);
    return result = {
        lat: rLat,
        lng: rLng
    };
}

function stringCoordToFloat(coord) {
    return result = {
        x: parseFloat(coord.x),
        y: parseFloat(coord.y),
        z: parseFloat(coord.z),
    };
};
