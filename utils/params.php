<?php

$getParams = array(
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

$javascriptToPrint = array();

// Get any parameters and do stuff.. I guess

foreach ($getParams as $key => $parameters) {

    if (isset($_GET[$key])){
        echo "$key is set<br/>";
        $gotParams = array();
        $javascript = "";

        foreach ($parameters as $paramName => $type) {
            if ($paramName == "_js"){
                $javascript = $type;
                continue;
            }
            echo "Checking $paramName<br/>";
            if(isset($_GET[$paramName])){ // Been set, check it and add it

                $val = $_GET[$paramName];

                settype($val, $type);

                array_push($gotParams, $val);
                unset($_GET[$paramName]);
            }
        }
        // Now that we have each parameter, format the JS code and add it to the array
        $formattedString = vsprintf($javascript, $gotParams);

        array_push($javascriptToPrint, $formattedString);
    }

    if(isset($_GET[$key])){
        unset($_GET[$key]);
    }
}

// Echos the JS for the params to work
function printJsForParams(){
    global $javascriptToPrint;

    $js = "";
    foreach ($javascriptToPrint as $value) {
        $js .= "$value\n";
    }

    echo "<script>$(document).ready(function(){
        setTimeout(function(){ // Give the page some time to load all other JS code.
            // Inject the code gotten from the parameters
            $js
        }, 500);
     });</script>";
}

?>
