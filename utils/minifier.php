<?php

/**
 * Concatenate an array of files into a string
 *
 * @param $files
 * @return string
 */
function concatenateFiles($files) {
    $buffer = '';

    foreach($files as $file) {
        $buffer .= file_get_contents($file);
    }

    return $buffer;
}

/**
 * @param $files
 * @return mixed|string
 */
function minifyCSS($files) {
    $buffer = concatenateFiles($files);

    $buffer = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $buffer);
    $buffer = str_replace(["\r\n","\r","\n","\t",'  ','    ','     '], '', $buffer);
    $buffer = preg_replace(['(( )+{)','({( )+)'], '{', $buffer);
    $buffer = preg_replace(['(( )+})','(}( )+)','(;( )*})'], '}', $buffer);
    $buffer = preg_replace(['(;( )+)','(( )+;)'], ';', $buffer);

    return $buffer;
}

/**
 * @param $files
 * @return mixed|string
 */
function minifyJS($files) {
    $buffer = concatenateFiles($files);

    $buffer = preg_replace("/((?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:\/\/.*))/", "", $buffer);
    $buffer = str_replace(["\r\n","\r","\t","\n",'  ','    ','     '], '', $buffer);
    $buffer = preg_replace(['(( )+\))','(\)( )+)'], ')', $buffer);

    return $buffer;
}

function printCss($debug){
    $cssFiles = array("style/src/bootstrap.css",
                        "style/src/bootstrap-theme.css",
                        "style/src/style.css");
    if($debug){
        foreach($cssFiles as $fname){
            echo "<link type=\"text/css\" rel=\"stylesheet\" href=\"$fname\">";
        }
    }else{
        echo "<style>";
        echo minifyCSS($cssFiles);
        echo "</style>";
    }
}

function printFirstJs($debug){
    $jsFiles = array("js/src/init.js", "js/src/objects.js",
                    "js/src/utils.js", "js/src/map.js",
                    "js/src/markers.js", "js/src/socket.js");

    if($debug){
        foreach($jsFiles as $fname){
            echo "<script type=\"text/javascript\" src=\"$fname\"></script>\n";
        }
    }else{
        echo "<script>";
        echo minifyJs($jsFiles);
        echo "</script>";
    }
}

function printLastJs($debug){
    $jsFiles = array("js/src/controls.js");

    if($debug){
        foreach($jsFiles as $fname){
            echo "<script type=\"text/javascript\" src=\"$fname\"></script>\n";
        }
    }else{
        echo "<script>";
        echo minifyJs($jsFiles);
        echo "</script>";
    }
}


?>
