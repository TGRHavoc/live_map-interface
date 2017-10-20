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

class ParamParser {

    private static $instance = NULL;

    public static function getParser(){
        if (is_null(self::$instance)){
            self::$instance = new self();
        }
        return self::$instance;
    }

    private $getParams = array(
        //If this is present, the rest is parsed.
        /*
            The higher in the array, the higher priority the parameter is..
            This means you should put the stuff that requires multiple parameters at the top.
        */

        "track" => // If this is present as a GET parameter, the rest are parsed
            array(
                "track" => "string", // We want to get the value of "tracked" as a string,
                "_js" => '$("#playerSelect").val("%s"); $("#playerSelect").change();' // the parameters above will be parsed into this string (see "trackAndZoom")
            ),

        /*
            Example query

            ?trackAndZoom&id=ip:127.0.0.1&zoom=3
            ?trackAndZoom&id=steam:11000010573D0E2&zoom=6
        */
        "trackAndZoom" =>
            array(
                "id" => "string",
                "zoom" => "int",
                "_js" => '$("#playerSelect").val("%s"); $("#playerSelect").change(); map.setZoom(%d);'
            ),

        // Zoom won't be ran if "trackAndZoom" is ran because the "zoom" parameter is unset
        "zoom" =>
            array(
                "zoom" => "int",
                "_js" => "map.setZoom(%d);"
            ),

    );
    private $javascriptToPrint = array();

    // Get any parameters and do stuff.. I guess
    public function __construct(){
        foreach ($this->getParams as $key => $parameters) {

            if (isset($_GET[$key])){
                $gotParams = array();
                $javascript = "";

                foreach ($parameters as $paramName => $type) {
                    if ($paramName == "_js"){
                        $javascript = $type;
                        continue;
                    }
                    if(isset($_GET[$paramName])){ // Been set, check it and add it

                        $val = $_GET[$paramName];

                        settype($val, $type);

                        array_push($gotParams, $val);
                        unset($_GET[$paramName]);
                    }
                }
                // Now that we have each parameter, format the JS code and add it to the array
                $formattedString = vsprintf($javascript, $gotParams);

                array_push($this->javascriptToPrint, $formattedString);
            }

            if(isset($_GET[$key])){
                unset($_GET[$key]);
            }
        }
    }

    // Echos the JS for the params to work
    public function printJsForParams(){
        $js = "";
        foreach ($this->javascriptToPrint as $value) {
            $js .= "$value\n";
        }

        echo "<script>$(document).ready(function(){
            setTimeout(function(){ // Give the page some time to load all other JS code.
                // Inject the code gotten from the parameters
                $js
            }, 500);
         });</script>";
    }
}


?>
