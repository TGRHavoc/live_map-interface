<?php
/*
    This is the config for the webapp.
    Please change the values to make it work.

    DO NOT CHANGE ANY VARIABLE THAT SAYS NOT TO CHANGE.
*/

// Set to false to enable the miinified versions of JS and CSS files
// that should speed up content delivery on production websites
$debug = true;

// Set to the IP of your FiveM server (public address).
$fivemIP = "127.0.0.1";

// Set to the port your FiveM server is using (needs to be reachable from the internet)
$fivemPort = "30120";

// Set to the port that you set in the "socket_port" convar.
// If you haven't set this in the config, don't change this.
$socketPort = "30121";

// Set to the name of the "live_map" resourcee that is added to the FiveM server.
// Note: If you change the folder name on the GTA server you NEED to change this
$liveMapName = "live_map";

// These will be injected into the JS code to configure how the map works

// The directory that contains the folders for the map tiles. Can be relative or, full URL..
// Make sure it has the trailing slash
$mapTileUrl = "images/map/";

// The directory that contains the folders for the map icons. Can be relative or a URL.
// Make sure it has the trailing slash.
$mapIconUrl = "images/icons/";

// Controls whether the atlas map is enabled or not
// (WARNING: REQUIRES "atlas" TILE DIRECTORY INSIDE "mapTileUrl")
$atlasEnabled = true;
// Controls whether the satellite map is enabled or not
// (WARNING: REQUIRES "satellite" TILE DIRECTORY INSIDE "mapTileUrl")
$satelliteEnabled = true;
// Controls whether the road map is enabled or not
// (WARNING: REQUIRES "road" TILE DIRECTORY INSIDE "mapTileUrl")
$roadEnabled = true;
// Controls whether the uv-invert map is enabled or not
// (WARNING: REQUIRES "uv-invert" TILE DIRECTORY INSIDE "mapTileUrl"
$uvInveredEnabled = true;

// Do you want to show the player's identifiers on the map?
// Note: THIS MAY BE THE PLAYER'S IP ADDRESS
$showIdentifiers = true;

// DO NOT CHANGE
$gtaServer = "http://$fivemIP:$fivemPort/";
// DO NOT CHANGE
$socketUrl = "ws://$fivemIP:$socketPort/";

// Builds the url that we need to use in ajax requests to get the blips
// DO NOT CHANGE
$blipUrl = $gtaServer . $liveMapName . "/blips.json";


?>
