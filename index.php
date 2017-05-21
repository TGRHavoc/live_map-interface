<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Live map</title>

        <style type="text/css">
            .gm-style .gm-style-iw{font-weight:300;font-size:13px;overflow:hidden}.gm-style .gm-iw{color:#2c2c2c}.gm-style .gm-iw b{font-weight:400}.gm-style .gm-iw a:link,.gm-style .gm-iw a:visited{color:#4272db;text-decoration:none}.gm-style .gm-iw a:hover{color:#4272db;text-decoration:underline}.gm-style .gm-iw .gm-title{font-weight:400;margin-bottom:1px}.gm-style .gm-iw .gm-basicinfo{line-height:18px;padding-bottom:12px}.gm-style .gm-iw .gm-website{padding-top:6px}.gm-style .gm-iw .gm-photos{padding-bottom:8px;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none}.gm-style .gm-iw .gm-sv,.gm-style .gm-iw .gm-ph{cursor:pointer;height:50px;width:100px;position:relative;overflow:hidden}.gm-style .gm-iw .gm-sv{padding-right:4px}.gm-style .gm-iw .gm-wsv{cursor:pointer;position:relative;overflow:hidden}.gm-style .gm-iw .gm-sv-label,.gm-style .gm-iw .gm-ph-label{cursor:pointer;position:absolute;bottom:6px;color:#fff;font-weight:400;text-shadow:rgba(0,0,0,0.7) 0 1px 4px;font-size:12px}.gm-style .gm-iw .gm-stars-b,.gm-style .gm-iw .gm-stars-f{height:13px;font-size:0}.gm-style .gm-iw .gm-stars-b{position:relative;background-position:0 0;width:65px;top:3px;margin:0 5px}.gm-style .gm-iw .gm-rev{line-height:20px;-ms-user-select:none;-moz-user-select:none;-webkit-user-select:none}.gm-style.gm-china .gm-iw .gm-rev{display:none}.gm-style .gm-iw .gm-numeric-rev{font-size:16px;color:#dd4b39;font-weight:400}.gm-style .gm-iw.gm-transit{margin-left:15px}.gm-style .gm-iw.gm-transit td{vertical-align:top}.gm-style .gm-iw.gm-transit .gm-time{white-space:nowrap;color:#676767;font-weight:bold}.gm-style .gm-iw.gm-transit img{width:15px;height:15px;margin:1px 5px 0 -20px;float:left}.gm-iw {text-align:left;}.gm-iw .gm-numeric-rev {float:left;}.gm-iw .gm-photos,.gm-iw .gm-rev {direction:ltr;}.gm-iw .gm-stars-f, .gm-iw .gm-stars-b {background:url("http://maps.gstatic.com/mapfiles/api-3/images/review_stars.png") no-repeat;background-size: 65px 26px;float:left;}.gm-iw .gm-stars-f {background-position:left -13px;}.gm-iw .gm-sv-label,.gm-iw .gm-ph-label {left: 4px;}

            .gm-style .gm-style-mtc label,.gm-style .gm-style-mtc div{font-weight:400}

            @media print {  .gm-style .gmnoprint, .gmnoprint {    display:none  }}@media screen {  .gm-style .gmnoscreen, .gmnoscreen {    display:none  }}

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
        <link type="text/css" rel="stylesheet" href="style/bootstrap.css">
        <link type="text/css" rel="stylesheet" href="style/style.css">

        <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
        <script type="text/javascript" src="js/app.js"></script>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBbYDZMGkewhRTGRJS4wwSVuBipYlYf-SU"></script>

        <script>
			///////////////////////////////////////////////////////////////////////////
			// CONFIGURATION STARTS HERE
			///////////////////////////////////////////////////////////////////////////

			// Set relative tile directory
			var _MAP_tileURL = "images/map/";

			// Set relative icon directory
			var _MAP_iconURL = "images/icons/";

			// Set if to show Atlas map (WARNING: REQUIRES ATLAS MAP TILE DIRECTORY)
			// Set "true" to show map
			// Set "false" to not show map
			var _MAP_atlasMap = true;

			// Set if to show Satellite map (WARNING: REQUIRES SATELLITE MAP TILE DIRECTORY)
			// Set "true" to show map
			// Set "false" to not show map
			var _MAP_satelliteMap = true;

			// Set if to show Road map (WARNING: REQUIRES ROAD MAP TILE DIRECTORY)
			// Set "true" to show map
			// Set "false" to not show map
			var _MAP_roadMap = true;

			// Set if to show UV Invert map (WARNING: REQUIRES UV INVERT MAP TILE DIRECTORY)
			// Set "true" to show map
			// Set "false" to not show map
			var _MAP_UVInvMap = false;

            // Set to the IP of the GTA V server running "live_map"
            var _SETTINGS_queryIp = "http://localhost/map-api";

            var _SETTINGS_socketUrl = "ws://localhost:30121"

		</script>

        <!-- IF DEBUG. Use un-minified version -->
        <script type="text/javascript" src="js/src/init.js"></script>
        <script type="text/javascript" src="js/src/markers.js"></script>
        <script type="text/javascript" src="js/src/objects.js"></script>
        <script type="text/javascript" src="js/src/utils.js"></script>
        <script type="text/javascript" src="js/src/map.js"></script>
        <script type="text/javascript" src="js/src/socket.js"></script>

        <!-- IF PRODUCTION. Use minified version -->
        <!--
        <script type="text/javascript" src="js/init.js"></script>
        <script type="text/javascript" src="js/markers.min.js"></script>
        <script type="text/javascript" src="js/objects.js"></script>
        <script type="text/javascript" src="js/utils.js"></script>
        <script type="text/javascript" src="js/map.js"></script>
        <script type="text/javascript" src="js/socket.js"></script>
        -->

        <script>
            function startMarkers(){
                initMarkers(true);
                //initMarkers(false);
            }
        </script>

    </head>
    <body>

        <nav class="navbar navbar-default-invert navbar-static-top" style="margin: 0;">
            <div class="container-fluid">
                <div class="container">
                    <div class="navbar-brand" style="padding: 10px 15px">
                        <a href="https://identityrp.co.uk">
                            <img src="https://identityrp.co.uk/assets/logo-pmx43bj0.png" style="max-height: 30px" >
                        </a>
                    </div>
                </div>
            </div>
        </nav>

        <div id="wrapper">
			<div id="about-box" class="hidden">
				<br><br><strong>THIS MAP IS NOT AFFILIATED WITH TAKE TWO OR ROCKSTAR GAMES</strong>
			</div>
			<div id="map-holder" style="position: relative">
				<div id="map-canvas" style="position: relative; overflow: hidden; background-color: rgb(15, 168, 210);">
                </div>
			</div>
		</div>

    </body>

    <script>
        $(document).ready(function(){
            globalInit();
            connect();
        });
    </script>
</html>
