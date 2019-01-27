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

//These settings seem to work for tilesize 256 (the default). The resources I could find don't help here.. So, the values below are botched. And _seem_ to work alright.

// Gta 5's min max bounds
var game_min_x = -4000.00;
var game_max_x = 6000.00;
var game_min_y = 8000;
var game_max_y = -4000;

// Map's min max bounds based on Leaflet's shitty system
var map_min_x = 0;
var map_max_x = 585; // Don't fucking ask.
var map_min_y = 17; // IDFK why this needs to be 17 but, it seems to be accurate
var map_max_y = 256*3 - 45; // WHYYYY???

function normalize(value, min, max){
    return Math.abs((value - min) / (max - min));
}

function convertToMap(x, y) {
    var xPercent = normalize(x, game_min_x, game_max_x);
    var destX = xPercent * (Math.abs(map_max_x - map_min_x)) + map_min_x;

    var yPercent = normalize(y, game_min_y, game_max_y);
    var destY = yPercent * (Math.abs(map_max_y - map_min_y)) + map_min_y;
    
    console.log(destX, destY);
    return {x: destX, y: destY};
}

function convertToMapLeaflet(x, y){
    var t = convertToMap(x, y);
    return {lat: -t.y, lng: t.x};// Leaflet switches lat and lng around. Y gets lower the further down you go so.. Need to invert it
}

function stringCoordToFloat(coord) {
    return result = {
        x: parseFloat(coord.x),
        y: parseFloat(coord.y),
        z: parseFloat(coord.z),
    };
};
