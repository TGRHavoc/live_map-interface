<?php
// ************************************************************************** //
//            LiveMap Interface - The web interface for the livemap
//                    Copyright (C) 2017  Jordan Dalton
//
//      This program is free software: you can redistribute it and/or modify
//      it under the terms of the GNU General Public License as published by
//      the Free Software Foundation, either version 3 of the License, or
//      (at your option) any later version.
//
//      This program is distributed in the hope that it will be useful,
//      but WITHOUT ANY WARRANTY; without even the implied warranty of
//      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//      GNU General Public License for more details.
//
//      You should have received a copy of the GNU General Public License
//      along with this program in the file "LICENSE".  If not, see <http://www.gnu.org/licenses/>.
// ************************************************************************** //

/*
    Class used to group different server info together and make swiching between
    them easier
*/
class Servers {
    /*
        An array containing all your servers running the livemap resource.
        Only provide the information (e.g. ip) if it differs

        For example, if you have another server running on the same server but,
        different port just change the "fivemPort" and "socketPort" variables :)
    */
    private static $servers = array(
        "testy mc test" => array( // The name of the server (make unique)
            "ip" => "127.0.0.1", // The IP (if on something different to the one in the config)
            "fivemPort" => "30120", // The fivem port
            "socketPort" => "30121", // Set to the port that you set in the "socket_port" convar (if different to the one in the config)
            "liveMapName" => "live_map" // Set to the resource's name (if different to the one in the config)
        )
    );

    /***********************
    *
    *  NO TOUCHY BELOW
    *   SERIOUSLY, YOU'LL PROBABLY JUST FUCK SOOMETHING UP
    *
    ***********************/
    public function doesServerExist($name){
        return array_key_exists($name, self::$servers);
    }

    public function init(){
        $conf = Config::getConfig();
        $srv = NULL;
        $name = "";

        if(ISSET($_GET["server"])){
            $name = $_GET["server"];

            if(self::doesServerExist($name)){
                $srv = self::$servers[$name];
            }else{
                $name = key(self::$servers); // get the first server in array
                $srv = self::$servers[$name];
            }

            unset($_GET["server"]);
        }else{
            $name = key(self::$servers); // get the first server in array
            $srv = self::$servers[$name];
        }

        // Update the config for the new server
        if(array_key_exists("ip", $srv)){
            $conf->fivemIP = $srv["ip"];
        }
        if(array_key_exists("fivemPort", $srv)){
            $conf->fivemPort = $srv["fivemPort"];
        }
        if(array_key_exists("socketPort", $srv)){
            $conf->socketPort = $srv["socketPort"];
        }
        if(array_key_exists("liveMapName", $srv)){
            $conf->liveMapName = $srv["liveMapName"];
        }

        $conf->currentServer = $name;
    }

    public function getServers(){
        $serverNames = array();
        foreach(self::$servers as $key=>$val){
            $uri = sprintf("http://%s%s?server=%s", $_SERVER["SERVER_NAME"], $_SERVER["PHP_SELF"], urlencode($key));
            $serverNames[$key] = $uri;
        }
        return $serverNames;
    }

}

?>
