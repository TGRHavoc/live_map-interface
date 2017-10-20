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
var game_1_x = 1972.606;
var game_1_y = 3817.044;
var map_1_lng = -60.8258056640625;
var map_1_lat = 72.06379257078102;
var game_2_x = -1154.11;
var game_2_y = -2715.203;
var map_2_lng = -72.1417236328125;
var map_2_lat = 48.41572128171852;

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

function convertToMap(x, y) {
    var rLng = map_1_lng + (x - game_1_x) * (map_1_lng - map_2_lng) / (game_1_x - game_2_x);
    var rLat = map_1_lat + (y - game_1_y) * (map_1_lat - map_2_lat) / (game_1_y - game_2_y);
    return result = {
        lat: rLat,
        lng: rLng
    };
}

function convertToMapGMAP(x, y) {
    var rLng = map_1_lng + (x - game_1_x) * (map_1_lng - map_2_lng) / (game_1_x - game_2_x);
    var rLat = map_1_lat + (y - game_1_y) * (map_1_lat - map_2_lat) / (game_1_y - game_2_y);
    return new google.maps.LatLng(rLat, rLng);
}

function convertToMapGMAPcoord(coord) {
    var rLng = map_1_lng + (coord.x - game_1_x) * (map_1_lng - map_2_lng) / (game_1_x - game_2_x);
    var rLat = map_1_lat + (coord.y - game_1_y) * (map_1_lat - map_2_lat) / (game_1_y - game_2_y);
    return new google.maps.LatLng(rLat, rLng);
}

function stringCoordToFloat(coord) {
    return result = {
        x: parseFloat(coord.x),
        y: parseFloat(coord.y),
        z: parseFloat(coord.z),
    };
};
