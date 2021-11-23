
const Utils = {
    // :thinking: This seems to improve the accuracy. I think what the problem is, if that the images I'm using doesn't correlate 1:1 to the map I'm using as a reference
    // Reference image (for those who care): https://drive.google.com/file/d/0B-zvE86DVcv2MXhVSHZnc01QWm8/view
    // I'm pretty sure that the + and -'s account for the differences. So, maybe fine-tuning them will increase accuracy of the map.

    // Top left corner of the GTA Map
    game_1_x: -4000.0 - 230,
    game_1_y: 8000.0 + 420,

    // Around this location: https://tgrhavoc.me/fuck_you/retard/MGoWO6nCymLmFC3M98bXbXL7C.png.

    // It's the middle of the map and one tile up (in leaflet). You can find it's location on leaflet by running the line below in console
    //      let m = new L.Marker(Map.unproject([1024,1024*2],0)); m.addTo(Map);
    game_2_x: 400.0 - 30,
    game_2_y: -300.0 - 340.0,

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

    isNumeric: (n) => !isNaN(parseFloat(n)) && isFinite(n),

    convertToMap: (CurrentLayer, x, y) => {
        const h = CurrentLayer.options.tileSize * 3,
            w = CurrentLayer.options.tileSize * 2;

        const latLng1 = window.MapL.unproject([0, 0], 0);
        const latLng2 = window.MapL.unproject(
            [w / 2, h - CurrentLayer.options.tileSize],
            0
        );

        let rLng =
            latLng1.lng +
            ((x - Utils.game_1_x) * (latLng1.lng - latLng2.lng)) /
                (Utils.game_1_x - Utils.game_2_x);
        let rLat =
            latLng1.lat +
            ((y - Utils.game_1_y) * (latLng1.lat - latLng2.lat)) /
                (Utils.game_1_y - Utils.game_2_y);
        return {
            lat: rLat,
            lng: rLng,
        };
    },

    getMapBounds: (layer) => {
        const h = layer.options.tileSize * 3,
            w = layer.options.tileSize * 2,
            southWest = window.MapL.unproject([0, h], 0),
            northEast = window.MapL.unproject([w, 0], 0);

        return new L.LatLngBounds(southWest, northEast);
    },

    convertToMapLeaflet: (currentLayer, x, y) => {
        let t = Utils.convertToMap(currentLayer, x, y);
        return t;
    },

    stringCoordToFloat: (coord) => {
        return {
            x: parseFloat(coord.x),
            y: parseFloat(coord.y),
            z: parseFloat(coord.z),
        };
    },
};

const JsonStrip = {
    singleComment: 1,
    multiComment: 2,

    stripWithoutWhitespace: () => {
        return "";
    },

    stripWithWhitespace: (str, start, end) => {
        return str.slice(start, end).replace(/\S/g, " ");
    },

    stripJsonOfComments: (str, opts) => {
        opts = opts || {};

        const strip =
            opts.whitespace === false
                ? JsonStrip.stripWithoutWhitespace
                : JsonStrip.stripWithWhitespace;

        let insideString = false;
        let insideComment = false;
        let offset = 0;
        let ret = "";

        for (let i = 0; i < str.length; i++) {
            const currentChar = str[i];
            const nextChar = str[i + 1];

            if (!insideComment && currentChar === '"') {
                const escaped = str[i - 1] === "\\" && str[i - 2] !== "\\";
                if (!escaped) {
                    insideString = !insideString;
                }
            }

            if (insideString) {
                continue;
            }

            if (!insideComment && currentChar + nextChar === "//") {
                ret += str.slice(offset, i);
                offset = i;
                insideComment = JsonStrip.singleComment;
                i++;
            } else if (
                insideComment === JsonStrip.singleComment &&
                currentChar + nextChar === "\r\n"
            ) {
                i++;
                insideComment = false;
                ret += strip(str, offset, i);
                offset = i;
                continue;
            } else if (
                insideComment === JsonStrip.singleComment &&
                currentChar === "\n"
            ) {
                insideComment = false;
                ret += strip(str, offset, i);
                offset = i;
            } else if (!insideComment && currentChar + nextChar === "/*") {
                ret += str.slice(offset, i);
                offset = i;
                insideComment = JsonStrip.multiComment;
                i++;
                continue;
            } else if (
                insideComment === JsonStrip.multiComment &&
                currentChar + nextChar === "*/"
            ) {
                i++;
                insideComment = false;
                ret += strip(str, offset, i + 1);
                offset = i + 1;
                continue;
            }
        }

        return (
            ret +
            (insideComment ? strip(str.substr(offset)) : str.substr(offset))
        );
    },
};

export { Utils, JsonStrip };