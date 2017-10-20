<?php

class Update{

    private static $version = "2.1.2";
    private static $url = "https://gist.githubusercontent.com/TGRHavoc/581ec66730b7abafe49ab616db87b0bb/raw/f27c6f2573dd1df0692f97c78a73f5687d20f791/live_map.versions";

    public static function latestVersion(){
        $data = file_get_contents(self::$url);
        $data = json_decode($data);

        return $data->interface == self::$version;
    }
}

?>
