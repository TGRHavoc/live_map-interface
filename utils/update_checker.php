<?php

class Update{

    private static $version = "2.1.3";
    private static $url = "https://raw.githubusercontent.com/TGRHavoc/live_map-interface/master/version.json";

    public static function latestVersion(){
        $data = file_get_contents(self::$url);
        $data = json_decode($data);

        return $data->interface == self::$version;
    }
}

?>
