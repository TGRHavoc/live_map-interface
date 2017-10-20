<!--

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

-->
<!DOCTYPE html>

<?php
	require_once("utils/minifier.php");
	require_once("utils/config.php");
	require_once("utils/params.php");
	require_once("utils/update_checker.php");

    Update::getCurrentVersion();

	$config = Config::getConfig();
	$parser = ParamParser::getParser();
?>

<html>
<head>
	<meta charset="utf-8">
	<title>Havoc's Live map</title>

	<link href="https://identityrp.co.uk/assets/favicon-79hd8bjv.png" rel="shortcut icon">

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
	<?php
		// Print the CSS stuff for the webapp. This will either print the minfied version or, links to the CSS filees
		Minifier::printCss($config->debug);
	?>

	<script src="js/jquery-3.2.1.min.js"></script>

	<!-- Change the key below -->
	<script type="text/javascript" src="https://maps.google.com/maps/api/js"></script>

	<script>

	///////////////////////////////////////////////////////////////////////////
	// PLEASE CHNAGE THE VAUES INSIDE THE CONFIG FILE
	///////////////////////////////////////////////////////////////////////////
	var _MAP_tileURL = "<?php echo $config->mapTileUrl; ?>";
	var _MAP_iconURL = "<?php echo $config->mapIconUrl; ?>";

	// Set if to show Atlas map (WARNING: REQUIRES "atlas" TILE DIRECTORY)
	var _MAP_atlasMap = <?php echo $config->atlasEnabled? 'true' : 'false'; ?>;

	// Set if to show Satellite map (WARNING: REQUIRES "satellite" TILE DIRECTORY)
	var _MAP_satelliteMap = <?php echo $config->satelliteEnabled? 'true' : 'false'; ?>;

	// Set if to show Road map (WARNING: REQUIRES "road" TILE DIRECTORY)
	var _MAP_roadMap = <?php echo $config->roadEnabled? 'true' : 'false'; ?>;

	// Set if to show UV Invert map (WARNING: REQUIRES "uv-invert" TILE DIRECTORY)
	var _MAP_UVInvMap = <?php echo $config->uvInveredEnabled? 'true' : 'false'; ?>;

	// Set to the IP of the GTA server running "live_map" and change the port to the
	// number that is set
	var _SETTINGS_socketUrl = "<?php echo $config->socketUrl() ?>";

	// Set to false if you don't want to show the player's identifiers (this may be their IP)
	var _SETTINGS_showIdentifiers = <?php echo $config->showIdentifiers? 'true' : 'false'; ?>;

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

	<nav class="navbar navbar-default-invert navbar-static-top" style="margin: 0;">
		<!-- At some point, I'll add more stuff here. For the time being, it'll just be the site logo -->
		<div class="container-fluid">
			<div class="container">
				<div class="navbar-brand" style="padding: 10px 15px">
					<!-- You can change this shit -->
					<a href="https://github.com/TGRHavoc/">
						<img src="https://avatars1.githubusercontent.com/u/1770893?s=460&v=4" style="max-height: 30px" >
					</a>
				</div>
			</div>
		</div>
	</nav>

	<div id="wrapper" class="container">
		<div id="map-holder" style="position: absolute">
			<div id="map-canvas" style="position: relative; overflow: hidden; background-color: rgb(15, 168, 210);"></div>
		</div>

		<div id="side-bar" class="sidebar-nav">
			<div class="well" style="padding: 8px 0;">
				<ul class="nav nav-list">
				  <li class="nav-header">Controls</li>

				  <li>
					  <a id="refreshBlips" href="#">Refresh Blips</a>
				  </li>

				  <li>
					  <a id="showBlips" href="#">Show Blips <span id="blips_enabled" class="label label-success pull-right">on</span></a>
				  </li>

				  <!--
				  <li>
					  <a id="toggleLive" href="#">Live update <span id="live_enabled" class="label label-danger pull-right">off</span></a>
				  </li>
				  -->
				  <li>
					  <a id="reconnect" href="#">Connect <span id="connection" class="label label-danger pull-right">disconnected</span></a>
				  </li>

				  <li id="socket_error" class="label label-danger"></li>

				  <li style="height: 50px;">
					  <a>
						  Track Player
						  <select id="playerSelect" class="input-large form-control pull-right" style="width: 65%">
							  <option></option>
						  </select>
					  </a>
				  </li>

				</ul>

				<ul class="nav nav-list" style="margin-top: 10px;">
				  <li class="nav-header">Information</li>

				  <li><a>Blips loaded <span id="blip_count" class="label label-info pull-right">0</span></a></li>

				  <li><a>Online players <span id="player_count" class="label label-info pull-right">0</span></a></li>
				</ul>
			</div>

			<p style="color: black; text-align: center;">This was originaly created by <a href="https://github.com/TGRHavoc">Havoc</a></p>

			<?php
				if (!Update::latestVersion()){
					// If not the latest version, tell them
			?>
				<p style="color: red; text-align: center; font-weight: 700;">An update is available, please download it <a href="https://github.com/TGRHavoc/live_map-interface">HERE</a></p>
			<?php
				}
			?>

		</div>
	</div>

<?php
	Minifier::printLastJs($config->debug);
	$parser->printJsForParams();
?>

</body>

</html>
