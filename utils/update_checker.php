<?php

class Update{

    public static $version = "2.1.3";
    private static $url = "https://raw.githubusercontent.com/TGRHavoc/live_map-interface/master/version.json";
    private static $downloadUrl = "http://github.com/TGRHavoc/live_map-interface";
    private static $latestVer = "";

    public static function latestVersion(){
        $data = file_get_contents(self::$url);
        $data = json_decode($data);

        self::$latestVer = $data->interface;

        return $data->interface == self::$version;
    }

    public static function getCurrentVersion(){
        $ver = file_get_contents("version.json") or die("Please contact the web admin. \"version.json\" doesn't exist! How am I supposed to check for updates?");
        $ver = json_decode($ver);

        self::$version = $ver->interface;
    }

    public static function alertJs(){
        $jsArrayString = sprintf("An update is available (%s -> %s). Please download it <a style=\'color: #000;\' href=\'%s\'>HERE.</a>", self::$version, self::$latestVer, self::$downloadUrl);

        return "<script> createAlert({ title: 'Update available', message: '" . $jsArrayString . "'}, {type: 'danger', delay: 0}); </script>";
    }
}

?>
