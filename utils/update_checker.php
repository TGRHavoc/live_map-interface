<?php

class Update{

    private static $version = "2.1.3";
    private static $url = "https://raw.githubusercontent.com/TGRHavoc/live_map-interface/master/version.json";

    public static function latestVersion(){
        $data = file_get_contents(self::$url);
        $data = json_decode($data);

        return $data->interface == self::$version;
    }

    public static function getCurrentVersion(){
        $ver = file_get_contents("version.json") or die("Please contact the web admin. \"version.json\" doesn't exist! How am I supposed to check for updates?");
        $ver = json_decode($ver);

        self::$version = $ver->interface;
    }

}

?>
