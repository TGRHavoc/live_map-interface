
// This file needs to be loaded first
class Utils {
    constructor() { }

    static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n)
    }
    static normalize(value, min, max) {
        return Math.abs((value - min) / (max - min));
    }

    static convertToMap(CurrentLayer, x, y) {
        const h = CurrentLayer.options.tileSize * 3,
            w = CurrentLayer.options.tileSize * 2;

        const latLng1 = window.MapL.unproject([0, 0], 0);
        const latLng2 = window.MapL.unproject([w / 2, (h - CurrentLayer.options.tileSize)], 0);

        let rLng = latLng1.lng + (x - Utils.game_1_x) * (latLng1.lng - latLng2.lng) / (Utils.game_1_x - Utils.game_2_x);
        let rLat = latLng1.lat + (y - Utils.game_1_y) * (latLng1.lat - latLng2.lat) / (Utils.game_1_y - Utils.game_2_y);
        return {
            lat: rLat,
            lng: rLng
        };
    }

    static getMapBounds(layer) {
        const h = layer.options.tileSize * 3,
            w = layer.options.tileSize * 2,
            southWest = window.MapL.unproject([0, h], 0),
            northEast = window.MapL.unproject([w, 0], 0);

        return new L.LatLngBounds(southWest, northEast);
    }

    static convertToMapLeaflet(currentLayer, x, y) {
        let t = this.convertToMap(currentLayer, x, y);
        return t;
    }

    static stringCoordToFloat(coord) {
        return {
            x: parseFloat(coord.x),
            y: parseFloat(coord.y),
            z: parseFloat(coord.z),
        };
    }

    /**
     *
     *
     * @static
     * @param {Object} coords
     * @param {number} coords.x
     * @param {number} coords.y
     * @param {number} coords.z
     * @memberof Utils
     */
    static getPositionHtml(coords) {
        let lang = window.Translator;
        return `<div class="row info-body-row"><strong>${lang.t("map.position")}:</strong>&nbsp;X ${coords.x.toFixed(2)} Y ${coords.y.toFixed(2)} Z ${coords.z.toFixed(2)}</div>`
    }

    /**
     *
     *
     * @static
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @memberof Utils
     */
    static getPositionHtmlWith(x, y, z) {
        return Utils.getPositionHtml({ x, y, z });
    }

    /**
     *
     *
     * @static
     * @param {string} key
     * @param {any} value
     * @return {string}
     * @memberof Utils
     */
    static getHtmlForInformation(key, value) {
        return `<div class="row info-body-row"><strong>${key}:</strong>&nbsp;${value}</div>`
    }

    static getInfoHtmlForMarkers(name, extraHtml) {
        return `<div class="info-window"><div class="info-header-box"><div class="info-header">${name}</div></div><div class="clear border"></div><div id="info-body">${extraHtml}</div></div>`
    }

    static getPlayerInfoHtml(plr) {
        //let html = '<div class="row info-body-row"><strong>Position:</strong>&nbsp;X {' + plr.pos.x.toFixed(0) + "} Y {" + plr.pos.y.toFixed(0) + "} Z {" + plr.pos.z.toFixed(0) + "}</div>";
        let html = Utils.getPositionHtml(plr.pos);

        for (let key in plr) {
            //console.log("found key: "+ key);
            if (key == "name" || key == "pos" || key == "icon") { // I should probably turn this into a array or something
                continue; // We're already displaying this info
            }

            if (key !== "identifier") {
                html += Utils.getHtmlForInformation(key, plr[key]);
                ///html += '<div class="row info-body-row"><strong>' + key + ':</strong>&nbsp;' + plr[key] + '</div>';
            } else if (Config.getConfig().showIdentifiers && key == "identifier") {
                html += Utils.getHtmlForInformation(key, plr[key]);
            } else {
                continue;
            }
        }
        return html;
    }

    static playerNameSorter(plr1, plr2) {
        let str1 = plr1.name;
        let str2 = plr2.name;

        return (str1 < str2) ? -1 : (str1 > str2) ? 1 : 0;
    }

    static getFilterProps(plr) {
        let props = [];
        for (let key in plr) {
            //console.log("found key: "+ key);
            if (key == "name" || key == "pos" || key == "icon") { // I should probably turn this into a array or something
                continue; // We're already displaying this info
            }

            if (key !== "identifier") {
                props.push(key);
            } else if (Config.getConfig().showIdentifiers && key == "identifier") {
                props.push(key);
            } else {
                continue;
            }
        }

        return props;
    }

    /**
     * Return if a particular option exists in a <select> object
     * @param {String} needle A string representing the option you are looking for
     * @param {Object} haystack A Select object
    */
    static optionExists(needle, haystack) {
        var optionExists = false,
            optionsLength = haystack.length;

        while (optionsLength--) {
            if (haystack.options[optionsLength].value === needle) {
                optionExists = true;
                break;
            }
        }
        return optionExists;
    }
}

// :thinking: This seems to improve the accuracy. I think what the problem is, if that the images I'm using doesn't correlate 1:1 to the map I'm using as a reference
// Reference image (for those who care): https://drive.google.com/file/d/0B-zvE86DVcv2MXhVSHZnc01QWm8/view
// I'm pretty sure that the + and -'s account for the differences. So, maybe fine-tuning them will increase accuracy of the map.

// Top left corner of the GTA Map
Utils.game_1_x = -4000.00 - 230;
Utils.game_1_y = 8000.00 + 420;

// Around this location: https://tgrhavoc.me/fuck_you/retard/MGoWO6nCymLmFC3M98bXbXL7C.png.

// It's the middle of the map and one tile up (in leaflet). You can find it's location on leaflet by running the line below in console
//      let m = new L.Marker(Map.unproject([1024,1024*2],0)); m.addTo(Map);
Utils.game_2_x = 400.00 - 30;
Utils.game_2_y = -300.0 - 340.00;

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


class JsonStrip {
    constructor() {
        this.singleComment = 1;
        this.multiComment = 2;
    }

    static stripWithoutWhitespace() { return ''; }
    static stripWithWhitespace(str, start, end) { return str.slice(start, end).replace(/\S/g, ' '); }

    static stripJsonOfComments(str, opts) {
        opts = opts || {};

        const strip = opts.whitespace === false ? JsonStrip.stripWithoutWhitespace : JsonStrip.stripWithWhitespace;

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
                insideComment = this.singleComment;
                i++;
            } else if (insideComment === this.singleComment && currentChar + nextChar === '\r\n') {
                i++;
                insideComment = false;
                ret += strip(str, offset, i);
                offset = i;
                continue;
            } else if (insideComment === this.singleComment && currentChar === '\n') {
                insideComment = false;
                ret += strip(str, offset, i);
                offset = i;
            } else if (!insideComment && currentChar + nextChar === '/*') {
                ret += str.slice(offset, i);
                offset = i;
                insideComment = this.multiComment;
                i++;
                continue;
            } else if (insideComment === this.multiComment && currentChar + nextChar === '*/') {
                i++;
                insideComment = false;
                ret += strip(str, offset, i + 1);
                offset = i + 1;
                continue;
            }
        }

        return ret + (insideComment ? strip(str.substr(offset)) : str.substr(offset));
    }
}

export { Utils, JsonStrip };
