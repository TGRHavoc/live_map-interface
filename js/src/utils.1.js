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


// :thinking: This seems to improve the accuracy. I think what the problem is, if that the images I'm using doesn't correlate 1:1 to the map I'm using as a reference
// Reference image (for those who care): https://drive.google.com/file/d/0B-zvE86DVcv2MXhVSHZnc01QWm8/view
// I'm pretty sure that the + and -'s account for the differences. So, maybe fine-tuning them will increase accuracy of the map.

// Top left corner of the GTA Map
var game_1_x = -4000.00 - 230;
var game_1_y = 8000.00 + 420;

// Around this location: https://tgrhavoc.me/fuck_you/retard/MGoWO6nCymLmFC3M98bXbXL7C.png.

// It's the middle of the map and one tile up (in leaflet). You can find it's location on leaflet by running the line below in console
//      var m = new L.Marker(Map.unproject([1024,1024*2],0)); m.addTo(Map);
var game_2_x = 400.00 - 30;
var game_2_y = -300.0 - 340.00;

// Some information. I've spent too long looking at this to clearly see a patten
// 0 0 for leaflet = -4000 8000 for GTA
// mapWidth mapHeight for leaflet = 7000 -4000 for GTA
//       2048 3072 = 7000 -4000
//       4096 6144 = 7000 -4000

//                                  Leaflet assumes tileSize = 1024
//
// tile 1 in game =                 tile 1 in leaflet:       gta delta      leaflet delta:
// p1: -4000, 8000 (top left)           0,0                      y: 4200        y: 1024 (tilesize)
// p2: -4000, 3800 (bottom left)        0,1024                   x: 4400        x: 1024 (tilesize)
// p3:  400, 8000 (top right)           1024,0
// p4:  400, 3800 (bottom rigt)         1024,1024

function convertToMap(x, y) {
    var h = CurrentLayer.options.tileSize * 3,
        w = CurrentLayer.options.tileSize * 2;

    var latLng1 = Map.unproject([0, 0], 0);
    var latLng2 = Map.unproject([w / 2, (h - CurrentLayer.options.tileSize)], 0);

    var rLng = latLng1.lng + (x - game_1_x) * (latLng1.lng - latLng2.lng) / (game_1_x - game_2_x);
    var rLat = latLng1.lat + (y - game_1_y) * (latLng1.lat - latLng2.lat) / (game_1_y - game_2_y);
    return result = {
        lat: rLat,
        lng: rLng
    };
}

function getMapBounds(layer){
    var h = layer.options.tileSize * 3,
        w = layer.options.tileSize * 2;

    var southWest = Map.unproject([0, h], 0);
    var northEast = Map.unproject([w, 0], 0);

    return new L.LatLngBounds(southWest, northEast);
}

// Stripping JSON comments
const singleComment = 1;
const multiComment = 2;
const stripWithoutWhitespace = () => '';
const stripWithWhitespace = (str, start, end) => str.slice(start, end).replace(/\S/g, ' ');

function stripJsonOfComments(str, opts) {
    opts = opts || {};

    const strip = opts.whitespace === false ? stripWithoutWhitespace : stripWithWhitespace;

    let insideString = false;
    let insideComment = false;
    let offset = 0;
    let ret = '';

    for (let i = 0; i < str.length; i++) {
        const currentChar = str[i];
        const nextChar = str[i + 1];

        if (!insideComment && currentChar === '"') {
            const escaped = str[i - 1] === '\\' && str[i - 2] !== '\\';
            if (!escaped) {
                insideString = !insideString;
            }
        }

        if (insideString) {
            continue;
        }

        if (!insideComment && currentChar + nextChar === '//') {
            ret += str.slice(offset, i);
            offset = i;
            insideComment = singleComment;
            i++;
        } else if (insideComment === singleComment && currentChar + nextChar === '\r\n') {
            i++;
            insideComment = false;
            ret += strip(str, offset, i);
            offset = i;
            continue;
        } else if (insideComment === singleComment && currentChar === '\n') {
            insideComment = false;
            ret += strip(str, offset, i);
            offset = i;
        } else if (!insideComment && currentChar + nextChar === '/*') {
            ret += str.slice(offset, i);
            offset = i;
            insideComment = multiComment;
            i++;
            continue;
        } else if (insideComment === multiComment && currentChar + nextChar === '*/') {
            i++;
            insideComment = false;
            ret += strip(str, offset, i + 1);
            offset = i + 1;
            continue;
        }
    }

    return ret + (insideComment ? strip(str.substr(offset)) : str.substr(offset));
};

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
