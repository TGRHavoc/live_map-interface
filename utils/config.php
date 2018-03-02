<?php
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

class Config{

    /*
        This is the config for the webapp.
        Please change the values to make it work.

        DO NOT CHANGE ANY VARIABLE THAT SAYS NOT TO CHANGE.
    */

    // Set to false to enable the miinified versions of JS and CSS files
    // that should speed up content delivery on production websites
    public $debug = true;

    // Set to the IP of your FiveM server (public address).
    public $fivemIP = "127.0.0.1";

    // Set to the port your FiveM server is using (needs to be reachable from the internet)
    public $fivemPort = "30120";

    // Set to the port that you set in the "socket_port" convar.
    // If you haven't set this in the config, don't change this.
    public $socketPort = "30121";

    // Set to the name of the "live_map" resourcee that is added to the FiveM server.
    // Note: If you change the folder name on the GTA server you NEED to change this
    public $liveMapName = "live_map";

    // These will be injected into the JS code to configure how the map works

    // The directory that contains the folders for the map tiles. Can be relative or, full URL..
    // Make sure it has the trailing slash
    public $mapTileUrl = "images/map/";

    // The directory that contains the folders for the map icons. Can be relative or a URL.
    // Make sure it has the trailing slash.
    public $mapIconUrl = "images/icons/";

    // Controls whether the atlas map is enabled or not
    // (WARNING: REQUIRES "atlas" TILE DIRECTORY INSIDE "mapTileUrl")
    public $atlasEnabled = true;
    // Controls whether the satellite map is enabled or not
    // (WARNING: REQUIRES "satellite" TILE DIRECTORY INSIDE "mapTileUrl")
    public $satelliteEnabled = true;
    // Controls whether the road map is enabled or not
    // (WARNING: REQUIRES "road" TILE DIRECTORY INSIDE "mapTileUrl")
    public $roadEnabled = true;
    // Controls whether the uv-invert map is enabled or not
    // (WARNING: REQUIRES "uv-invert" TILE DIRECTORY INSIDE "mapTileUrl"
    public $uvInveredEnabled = true;
    // Controls whether the post-code map is enabled or not
    // (WARNING: REQUIRES "postcode" TILE DIRECTORY INSIDE "mapTileUrl"
    public $postcodeEnabled = false;

    // Do you want to show the player's identifiers on the map?
    // Note: THIS MAY BE THE PLAYER'S IP ADDRESS
    public $showIdentifiers = true;

    // DO NOT CHANGE ANYTHING BELOW

    public $currentServer = "";

    /**
    * Gets the URL for the GTA server.
    *
    * @return string The URL for the GTA server (e.g. "http://127.0.0.1:30120")
    */
    public function gtaServer(){
        return "http://$this->fivemIP:$this->fivemPort/";
    }

    /**
    * Gets the WebSocket URL for the "livemap" addon
    *
    * @return string The URL used to connect to the websocket server (e.g. "ws://127.0.0.1:30121")
    */
    public function socketUrl(){
        return "ws://$this->fivemIP:$this->socketPort/";
    }

    /**
    * Get the public URL for the "blips.json" file.
    *
    * @return string The URL you can use to get the blips file (e.g. "http://127.0.0.1:30120/live_map/blips.json")
    */
    public function blipUrl(){
        return $this->gtaServer() . $this->liveMapName . "/blips.json";
    }

    private static $instance = NULL;

    public static function getConfig(){
        if (is_null(self::$instance)){
            self::$instance = new self();
        }
        return self::$instance;
    }
}


?>
