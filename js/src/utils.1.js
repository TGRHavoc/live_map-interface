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

function convertToMap(x, y) {
    var h = CurrentLayer.options.tileSize * 3,
        w = CurrentLayer.options.tileSize * 2;

    var latLng1 = Map.unproject([w * 0.5, h * 0.5], Map.getMaxZoom());
    var latLng2 = Map.unproject([0, h], Map.getMaxZoom());

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

    var southWest = Map.unproject([0, h], Map.getMaxZoom());
    var northEast = Map.unproject([w, 0], Map.getMaxZoom());

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
