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
    Class used to minify CSS and JS files if needed.
    Mainly used to print minified versions if $debug is true in the config.
*/
class Minifier{

    /**
     * Concatenate an array of files into a string
     *
     * @param $files
     * @return string
     */
    private static function concatenateFiles($files) {
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
    private static function minifyCSS($files) {
        $buffer = Minifier::concatenateFiles($files);

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
    private static function minifyJS($files) {
        $buffer = Minifier::concatenateFiles($files);

        $buffer = preg_replace("/((?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:\/\/.*))/", "", $buffer);
        $buffer = str_replace(["\r\n","\r","\t","\n",'  ','    ','     '], '', $buffer);
        $buffer = preg_replace(['(( )+\))','(\)( )+)'], ')', $buffer);

        return $buffer;
    }

    public static function printCss($debug){
        $cssFiles = array("style/src/bootstrap.css", "style/src/bootstrap-grid.css",
             "style/src/bootstrap-grid.css", "style/src/style.css");
        if($debug){
            foreach($cssFiles as $fname){
                echo "<link type=\"text/css\" rel=\"stylesheet\" href=\"$fname\">";
            }
        }else{
            echo "<style>";
            echo Minifier::minifyCSS($cssFiles);
            echo "</style>";
        }
    }

    public static function printFirstJs($debug){
        $jsFiles = array("js/src/alerter.js", "js/src/objects.js",
                        "js/src/utils.js", "js/src/map.js",
                        "js/src/markers.js", "js/src/init.js", "js/src/socket.js");

        if($debug){
            foreach($jsFiles as $fname){
                echo "<script type=\"text/javascript\" src=\"$fname\"></script>\n";
            }
        }else{
            echo "<script>";
            echo Minifier::minifyJs($jsFiles);
            echo "</script>";
        }
    }

    public static function printLastJs($debug){
        $jsFiles = array("js/src/controls.js");

        if($debug){
            foreach($jsFiles as $fname){
                echo "<script type=\"text/javascript\" src=\"$fname\"></script>\n";
            }
        }else{
            echo "<script>";
            echo Minifier::minifyJs($jsFiles);
            echo "</script>";
        }
    }
}

?>
