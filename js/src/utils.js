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
