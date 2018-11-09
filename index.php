<!--

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

-->
<!DOCTYPE html>

<?php
    require_once("utils/minifier.php");
    require_once("utils/config.php");
    require_once("utils/params.php");
    require_once("utils/update_checker.php");
    //require_once("utils/servers.php");

    Update::getCurrentVersion();

    $config = Config::getConfig();
    $parser = ParamParser::getParser();

    if(ISSET($_GET["server"])){
        $name = $_GET["server"];

        if(array_key_exists($name, Config::$servers)){
            $srv = Config::$servers[$name];
        }else{
            $name = key(Config::$servers); // get the first server in array
            $srv = Config::$servers[$name];
        }

        unset($_GET["server"]);
    }else{
        $name = key(Config::$servers); // get the first server in array
        $srv = Config::$servers[$name];
    }

    // Update the config for the new server
    if(array_key_exists("ip", $srv)){
        $config->fivemIP = $srv["ip"];
    }
    if(array_key_exists("fivemPort", $srv)){
        $config->fivemPort = $srv["fivemPort"];
    }
    if(array_key_exists("socketPort", $srv)){
        $config->socketPort = $srv["socketPort"];
    }
    if(array_key_exists("liveMapName", $srv)){
        $config->liveMapName = $srv["liveMapName"];
    }

    $config->currentServer = $name;

?>

<html>
<head>
    <meta charset="utf-8">
    <title>Havoc's Live map</title>

    <!-- Pin favicon from: https://www.freefavicon.com/freefavicons/objects/iconinfo/map-pin-152-195874.html -->
    <link href="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP74zAv++Mwn/vjMMf74zDH++Mwm//jMCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD++c0d/vnNROPLnGDw4bRX/vnNQ/75zRkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFKwBThSsAQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFLQABhSwAvIUsAKyGLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhS0AYYUtAP+FLQD+hS0AUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACGLgAAhi4AYYUtAPmFLQD/hS0A/4UtAPWGLgBVhi4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHLwABhi4AkoUuAP+MMQD/uEQA/7ZDAP+LMAD/hS4A/oYuAIONNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhzAAWoYvAP/DTQD//8Ay///mSP//5Uj//7ov/7dHAP+FLwD+hi8ASgAAAAAAAAAAAAAAAAAAAAAAAAAAiC0AAIYwAM2UNgD//888///pS///6Uv//+lL///pS///xjf/jTMA/4UwAL0AAAAAAAAAAAAAAAAAAAAAAAAAAIYxAAmGMAD66WQN///qTP//6Uz//+lM///pTP//6Uz//+pM/9NYCP+FMADxhTAAAwAAAAAAAAAAAAAAAAAAAACFMQALhTEA/PduE///6k3//+pN///qTf//6k3//+pN///qTf/iYg7/hTEA84MxAAMAAAAAAAAAAAAAAAAAAAAAhDEAAYQxANemQwH//+RK///qTf//6k3//+pN///qTf//30j/mjwA/4UxAMcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEMgBshDEA//93Gf//50z//+tO///rTv//5Ev/8W0V/4QxAP+EMgBbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgzIAA4MyAK+CMQD/tEwH//+AH///fh7/rUgF/4IxAP+BMQCggDEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACDMgAEgjIAc4MyAOCDMgD+gzIA/oEyANyCMgBqgDEAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+MAACgTIAFn4xABV/MQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+B8AAPgfAAD+fwAA/D8AAPw/AADwDwAA4AcAAOAHAADABwAAwAMAAMADAADABwAA4AcAAOAHAADwDwAA/D8AAA==" rel="icon" type="image/x-icon">

    <style type="text/css">
    .gm-style .gm-style-iw{font-weight:300;font-size:13px;overflow:hidden}.gm-style .gm-iw{color:#2c2c2c}.gm-style .gm-iw b{font-weight:400}.gm-style .gm-iw a:link,.gm-style .gm-iw a:visited{color:#4272db;text-decoration:none}.gm-style .gm-iw a:hover{color:#4272db;text-decoration:underline}.gm-style .gm-iw .gm-title{font-weight:400;margin-bottom:1px}.gm-style .gm-iw .gm-basicinfo{line-height:18px;padding-bottom:12px}.gm-style .gm-iw .gm-website{padding-top:6px}.gm-style .gm-iw .gm-photos{padding-bottom:8px;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none}.gm-style .gm-iw .gm-sv,.gm-style .gm-iw .gm-ph{cursor:pointer;height:50px;width:100px;position:relative;overflow:hidden}.gm-style .gm-iw .gm-sv{padding-right:4px}.gm-style .gm-iw .gm-wsv{cursor:pointer;position:relative;overflow:hidden}.gm-style .gm-iw .gm-sv-label,.gm-style .gm-iw .gm-ph-label{cursor:pointer;position:absolute;bottom:6px;color:#fff;font-weight:400;text-shadow:rgba(0,0,0,0.7) 0 1px 4px;font-size:12px}.gm-style .gm-iw .gm-stars-b,.gm-style .gm-iw .gm-stars-f{height:13px;font-size:0}.gm-style .gm-iw .gm-stars-b{position:relative;background-position:0 0;width:65px;top:3px;margin:0 5px}.gm-style .gm-iw .gm-rev{line-height:20px;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none}.gm-style.gm-china .gm-iw .gm-rev{display:none}.gm-style .gm-iw .gm-numeric-rev{font-size:16px;color:#dd4b39;font-weight:400}.gm-style .gm-iw.gm-transit{margin-left:15px}.gm-style .gm-iw.gm-transit td{vertical-align:top}.gm-style .gm-iw.gm-transit .gm-time{white-space:nowrap;color:#676767;font-weight:bold}.gm-style .gm-iw.gm-transit img{width:15px;height:15px;margin:1px 5px 0 -20px;float:left}.gm-iw {text-align:left;}.gm-iw .gm-numeric-rev {float:left;}.gm-iw .gm-photos,.gm-iw .gm-rev {direction:ltr;}.gm-iw .gm-stars-f, .gm-iw .gm-stars-b {background:url("http://maps.gstatic.com/mapfiles/api-3/images/review_stars.png") no-repeat;background-size: 65px 26px;float:left;}.gm-iw .gm-stars-f {background-position:left -13px;}.gm-iw .gm-sv-label,.gm-iw .gm-ph-label {left: 4px;}

    .gm-style .gm-style-mtc label,.gm-style .gm-style-mtc div{font-weight:400}

    @media print {  .gm-style .gmnoprint, .gmnoprint { display:none }}@media screen {  .gm-style .gmnoscreen, .gmnoscreen {    display:none  }}

    .gm-style {
        font: 400 11px Roboto, Arial, sans-serif;
        text-decoration: none;
    }

    .gm-style img { max-width: none; }

    @-webkit-keyframes _gm3821 {
        0% { -webkit-transform: translate3d(0px,-500px,0); -webkit-animation-timing-function: ease-in; }
        50% { -webkit-transform: translate3d(0px,0px,0); -webkit-animation-timing-function: ease-out; }
        75% { -webkit-transform: translate3d(0px,-20px,0); -webkit-animation-timing-function: ease-in; }
        100% { -webkit-transform: translate3d(0px,0px,0); -webkit-animation-timing-function: ease-out; }
    }

    </style>

    <link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700">
    <?php
        // Print the CSS stuff for the webapp. This will either print the minfied version or, links to the CSS filees
        Minifier::printCss($config->debug);
    ?>
	<link type="text/css" rel="stylesheet" href="style/fontawesome-all.min.css" />

    <script src="js/jquery-3.2.1.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>

    <script src="js/bootstrap.bundle.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
	<script src="js/bootstrap-notify.min.js"></script>

    <script type="text/javascript" src="https://maps.google.com/maps/api/js"></script>

    <script>

    ///////////////////////////////////////////////////////////////////////////
    // PLEASE CHNAGE THE VAUES INSIDE THE CONFIG FILE
    ///////////////////////////////////////////////////////////////////////////
    var _MAP_tileURL = "<?php echo $config->mapTileUrl; ?>";
    var _MAP_iconURL = "<?php echo $config->mapIconUrl; ?>";

    var _MAP_currentUri = "<?php echo $_SERVER["REQUEST_URI"]; ?>";

    // Sets whether it should showSets whether it should show Atlas map (WARNING: REQUIRES "atlas" TILE DIRECTORY)
    var _MAP_atlasMap = <?php echo json_encode($config->atlasEnabled); ?>;

    // Sets whether it should show Satellite map (WARNING: REQUIRES "satellite" TILE DIRECTORY)
    var _MAP_satelliteMap = <?php echo json_encode($config->satelliteEnabled); ?>;

    // Sets whether it should show Road map (WARNING: REQUIRES "road" TILE DIRECTORY)
    var _MAP_roadMap = <?php echo json_encode($config->roadEnabled); ?>;

    // Sets whether it should show UV Invert map (WARNING: REQUIRES "uv-invert" TILE DIRECTORY)
    var _MAP_UVInvMap = <?php echo json_encode($config->uvInveredEnabled); ?>;

    // Sets whether it should show Postcode map (WARNING: REQUIRES "postcode" TILE DIRECTORY)
    var _MAP_PostcodeMap = <?php echo json_encode($config->postcodeEnabled); ?>;

    // Set to the IP of the GTA server running "live_map" and change the port to the
    // number that is set
    var _SETTINGS_socketUrl = "<?php echo $config->socketUrl(); ?>";

    // Set to false if you don't want to show the player's identifiers (this may be their IP)
    var _SETTINGS_showIdentifiers = <?php echo json_encode($config->showIdentifiers); ?>;

    // show debug information in the console
    var _SETTINGS_debug = <?php echo json_encode($config->debug); ?>;

    var _SETTINGS_blipUrl = "<?php echo $config->blipUrl(); ?>";

    // Do not remove unless you know what you're doing (and you have a google api key)
    // Hack from https://stackoverflow.com/questions/38148097/google-maps-api-without-key/38809129#38809129
    // hack Google Maps to bypass API v3 key (needed since 22 June 2016 http://googlegeodevelopers.blogspot.com.es/2016/06/building-for-scale-updates-to-google.html)
    var target = document.head;
    var observer = new MutationObserver(function(mutations) {
        for (var i = 0; mutations[i]; ++i) { // notify when script to hack is added in HTML head
            if (mutations[i].addedNodes[0].nodeName == "SCRIPT" && mutations[i].addedNodes[0].src.match(/\/AuthenticationService.Authenticate?/g)) {
                var str = mutations[i].addedNodes[0].src.match(/[?&]callback=.*[&$]/g);
                if (str) {
                    if (str[0][str[0].length - 1] == '&') {
                        str = str[0].substring(10, str[0].length - 1);
                    } else {
                        str = str[0].substring(10);
                    }
                    var split = str.split(".");
                    var object = split[0];
                    var method = split[1];
                    window[object][method] = null; // remove censorship message function _xdc_._jmzdv6 (AJAX callback name "_jmzdv6" differs depending on URL)
                    //window[object] = {}; // when we removed the complete object _xdc_, Google Maps tiles did not load when we moved the map with the mouse (no problem with OpenStreetMap)
                }
                observer.disconnect();
            }
        }
    });
    var config = { attributes: true, childList: true, characterData: true }
    observer.observe(target, config);

    </script>

    <?php
        Minifier::printFirstJs($config->debug);
    ?>

</head>
<body>

    <nav class="navbar navbar-dark navbar-expand-md">
        <!-- At some point, I'll add more stuff here. For the time being, it'll just be the site logo -->
        <div class="container">
            <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <a class="navbar-brand" href="https://github.com/TGRHavoc/">
                    <img src="https://avatars1.githubusercontent.com/u/1770893?s=460&v=4" style="max-height: 30px" >
                    Live Map v<?php echo Update::$version ?>
            </a>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <!-- Servers -->
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Select a server
                        </a>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <?php
                                $srvs = Config::$servers;
                                foreach ($srvs as $key => $value) {
                                    $uri = urlencode($key);
                                    echo "<a class='dropdown-item' href='?server=$uri'>$key</a>";
                                }
                            ?>
                        </div>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" role="button" id="sidebarTooggle" data-toggle="collapse" data-target="#sidebar" aria-controls="sidebar" aria-label="Toggle sidebar" aria-expanded="false">
                            Hide/Show Controls
                        </a>
                    </li>


                    <li class="nav-item">
                        <a class="nav-link" role="button" id="blipToggle" data-toggle="collapse" data-target="#blip-filter-dropdown" aria-controls="blip-filter-dropdown" aria-label="Toggle blip controls" aria-expanded="false">
                            Blip controls
                        </a>
                    </li>

                </ul>
            </div>
        </div>

    </nav>

    <div id="wrapper" class="container-fluid">
        <div id="control-wrapper" >
            <div id="sidebar" class="custom-menu col-md-2 col-sm-6 col-xs-12 float-left collapse">
                <div class="list-group border-0 card text-center text-md-left" style="padding: 8px 0;">

                    <a class="nav-header">Controls</a>

                    <a class="list-group-item d-inline-block collapsed" id="refreshBlips" href="#">
                        <span class="d-md-inline">Refresh Blips</span>
                    </a>

                    <a id="showBlips" href="#" class="list-group-item d-inline-block collapsed">
                        <span class="d-md-inline">Show Blips</span>
                        <span id="blips_enabled" class="badge badge-pill badge-success pull-right">on</span>
                    </a>

                      <!--
                      <li>
                          <a id="toggleLive" href="#">Live update <span id="live_enabled" class="badge badge-danger pull-right">off</span></a>
                      </li>
                      -->
                    <a id="reconnect" href="#" class="list-group-item d-inline-block collapsed">
                        <span class="d-md-inline">Connect</span>
                        <span id="connection" class="badge badge-pill badge-danger pull-right">disconnected</span>
                    </a>

                    <a class="list-group-item d-inline-block collapsed">
                        <span class="d-md-inline">Track Player</span>

                        <select id="playerSelect" class="input-large form-control pull-right">
                            <option></option>
                        </select>
                    </a>
                </div>

                <div class="list-group border-0 card text-center text-md-left" >
                    <a class="nav-header">Information</a>

                    <a class="list-group-item d-inline-block collapsed">Currently viewing:
                        <p id="server_name" style="white-space: normal; color: #17A2B8">
                            <?php echo $config->currentServer; ?>
                        </p>
                    </a>

                    <a class="list-group-item d-inline-block collapsed">Blips loaded
                        <span id="blip_count" class="badge badge-pill badge-info pull-right">0</span>
                    </a>

                    <a class="list-group-item d-inline-block collapsed">Online players
                        <span id="player_count" class="badge badge-pill badge-info pull-right">0</span>
                    </a>
                </div>

                <div class="list-group border-0 card text-center text-md-left" style="margin-top: 10px;">
                    <p style="text-align: center;">This was originaly created by <a href="https://github.com/TGRHavoc">Havoc</a></p>
                </div>
            </div>

            <div id="blip-filter-dropdown" class="custom-menu col-sm-0 col-xs-0 col-md-12 collapse">
                <div class="list-group border-0 card text-center text-md-left" style="padding: 8px 0;">

                    <a class="nav-header">Blip Controls <small id="toggle-all-blips" class="btn btn-sm btn-info">Toggle all</small></a>

                    <div id="blip-control-container" class="row">

                    </div>

                </div>
            </div>
        </div>

        <main id="map-holder" class="col-12 main" >
            <div id="map-canvas" style="position: relative; overflow: hidden; background-color: rgb(15, 168, 210);"></div>
        </main>
    </div>

<?php
    Minifier::printLastJs($config->debug);
    $parser->printJsForParams();

    if(!Update::latestVersion()){
        echo Update::alertJs();
    }
?>

</body>

</html>
