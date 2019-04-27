Changelog
=========


v3.2.4 (26-04-2019)
-------------------

Changes
~~~~~~~
- Update socket.1.js. [Jordan Dalton]

  This should actually fix #33
- Update to v3.2.3. [Jordan Dalton]


v3.2.3 (16-04-2019)
-------------------

New
~~~
- Added "groupPlayers" to config. [Jordan Dalton]

  As per request in #32.
  Defaults to true so, people who don't care will automatically have grouping enabled.


v3.2.2 (16-04-2019)
-------------------

Changes
~~~~~~~
- Update changeServer to reset controls. [Jordan Dalton]

  This should reset the UI elements such as the player list when switching servers.
  Before, it wouldn't reset showing you the players for the previous server you were viewing.

  Not sure if this is related to #33.


v3.2.1 (16-04-2019)
-------------------

New
~~~
- Added a stiched image of the normal tileset. [Jordan Dalton]
- Added config to gitignore. [Jordan Dalton]

  I can see myself accidently pushing that at some point.
  So, I'd rather not risk it.

Changes
~~~~~~~
- Update marker accuracy. [Jordan Dalton]

  I'm starting to hate this project.

  The markers are now even more accurate but, they're still not 100%.
  I'm starting to think that it's beyond my capabilities.

Other
~~~~~
- Removed random print from control file. [Jordan Dalton]

  It spammed the console.
- Udpate changelog to remove "update dist files" [Jordan Dalton]

  It's not important enough to be in the changelog.


v3.2.0 (26-03-2019)
-------------------

New
~~~
- Added defaults to config. [Jordan Dalton]

  debug - false
  tileDirectory - "images/tiles"
  iconDirectory - "images/icons"
  showIdentifiers - false
- Added player filtering. [Jordan Dalton]
- Add clustering player icons. [Jordan Dalton]

  If a player marker is within 20 (or there abouts) pixels of another, they will be clustered together.

  To show a clustered player's information. Just click on their name.
- Added utils/config.html. [Jordan Dalton]

  This page should be used to generate JSON for the new config.json file.
- Add new console._log function. [Jordan Dalton]

  Before, everything was logged to console.
  Using the new _log function should only display logs when in debug mode
- Added font-awesome css. [Jordan Dalton]
- Added git pre-push hook. [Jordan Dalton]

  This is the hook I use to minify and commit the files for index.html
- Added html files. [Jordan Dalton]

  HTML is the new PHP. Now people can host the livemap on webservers that don't support PHP.
  Wooo
- Add bundler configs. [Jordan Dalton]

  Added the config files for webpack and crammit.
- Added tiles used during development. [Jordan Dalton]

  This should allow people to just download the interface and go.

  Before, they would have to extract the images themselves before use.
- Added example json config. [Jordan Dalton]

Changes
~~~~~~~
- Update changelog to v3.2.0. [Jordan Dalton]
- Update to v3.2.0. [Jordan Dalton]
- Update README to new version. [Jordan Dalton]
- Update blip controls. [Jordan Dalton]

  They no longer break when swicthing servers.
- Update font paths back to relative. [Jordan Dalton]

  Users running the map under a subdirectory would have had issues before.
  Now they shouldn't.
- Update bootstrap to 4.1.3. [Jordan Dalton]
- Update version check to JS. [Jordan Dalton]

  The version checking logic is now inside a JS file and should be bundled inside the last-bundle dist file.
- Update font-awesome fonts. [Jordan Dalton]
- Changed bundler software. [Jordan Dalton]

  Moved from crammit and webpack to a more appropriate gulp.
- Update webpack config to match previous PHP minifier. [Jordan Dalton]
- Update layer control to not disable layers. [Jordan Dalton]

  Before, the control would disable a layer if you zoomed out too far.
  This wasn't needed because we already set the map to fit the map bounds (it resizes based on the map).
  So, it's now overridden to remove this feature.
- Update scripts to use new global variables. [Jordan Dalton]

  Hopefully this makes the code more bareable to read
- Update utils to have stripJsonOfComments function. [Jordan Dalton]

  The function removes any comments inside a JSON string.

Fix
~~~
- Fixed nav item's class. [matsn0w]
- Fixed popup flickering on players. [Jordan Dalton]

  Instead of relying on Leaflet to handle the moving popups, the code handles it.
  This means that the popup isn't redrawing every time it moves position (I think that's what was heppening)
  So, we get a smooth experience with moving players.
- Fixed player clusters not being clickable. [Jordan Dalton]
- Fixed config defaults when loading config. [Jordan Dalton]

Other
~~~~~
- Increased marker accuracy. [Jordan Dalton]

  Still not 100% accurate. This CRS shit confuses me in regards to Leaflet.

  Anyways. Now tile's size must be set as 1024. It will be automatically scaled (at least, that's been my experience).
- Possibly fixed production error. [Jordan Dalton]

  Apparently leaflet is trying to call addLayer on a undefined variable.
  I don't get any error on debug.html only the index.html file.
- Renamed pre-push to post-commit. [Jordan Dalton]

  This is a better work flow. Now, I can guarantee that if I make any changes in a commit, they will be reflected in the dist files.
- Moved font locations and update all.css to have absolute path. [Jordan
  Dalton]

  Should allow the CSS to work on config.html as well as the other html files.
- Renames JS files with number to designate where they should be when
  bundled together. [Jordan Dalton]

  1.js files will be placed inside the "first-bundle.js"
  2.js files will be placed inside "last-bundle.js"
- Moved vendor files into a vendor folder. [Jordan Dalton]
- Removed php utility files. [Jordan Dalton]

  Starting to move everything over to plain HTML.
- WIP: Updating files to use new config.json file. [Jordan Dalton]


v3.1.0 (08-02-2019)
-------------------

Changes
~~~~~~~
- Update controls to new framework/Fixes #20. [Jordan Dalton]

  Hopefully this makes the map fully working with the new framework.

  I still want to do a bunch of cleaning up. Make sure there's no left over code. And it should be good to deploy.
- Update map utils for better accuracy with new framework. [Jordan
  Dalton]

  God. I. Hate. This.
  There's no guarantee that the values entered will work for everyone.
  There's no guarantee they will be accurate.
  And I cannot tell you for the life of me where the values have come from.
- Update static markers to new map. [Jordan Dalton]

  Static markers now use the new map framework.
- Update utils to new map. [Jordan Dalton]

  This should accuratly calculate the coords from in game to the map coords
- Update map code with better zooming. [Jordan Dalton]

  By default the map size is downscaled as to give a zoomed out feel.
  When zooming in, the framework will just scale the tiles we do have available.

Fix
~~~
- Fixed accuracy issues in the map markers. [Jordan Dalton]

  It was bugging me. This version still has it's issues but. it's a lot more accurate.


v3.0.0 (14-01-2019)
-------------------

New
~~~
- Added leaflet.js framework. [Jordan Dalton]

  Moved from Google's map to Leaflet.js's API.
- Added python files used to extract PNGs from YTD files. [Jordan
  Dalton]

  A simple python script to turn YTD files into PNGs.
  It literally goes thorugh the YTD archive and extracts ALL images it can find.
  This is used to transform the minimap files "minimap_sea_*_*.ytd" to PNG files for use in the interface.

  Just type `python extract_png.py` in the same directory as the YTD files.
- Add reverse proxy config. [Jordan Dalton]

  If people are smart and using reverse proxies, this commit should make life a little easier on them. Just set the "socketUrl" and/or "blipUrl" inside the "revsersProxy" setting and watch as your secure site becomes all green.


v2.2.11 (06-04-2018)
--------------------

Changes
~~~~~~~
- Update to v2.2.11. [Jordan Dalton]

Fix
~~~
- Fixed update alerts. [Jordan Dalton]

  Update alerts were still using the old alert system. Now it uses the new one.


v2.2.10 (06-04-2018)
--------------------

Changes
~~~~~~~
- Update to v2.2.10. [Jordan Dalton]

Fix
~~~
- Fixed blip icons not working on other servers. [Jordan Dalton]

  When selecting another server, the URL for the blip icons would change to `/server?test+server/images/icons` which, is wrong.


v2.2.9 (06-04-2018)
-------------------

New
~~~
- Add blip controls. [Jordan Dalton]

  Users can now toggle on/off the blips they want.

Changes
~~~~~~~
- Update to v2.2.9. [Jordan Dalton]
- Update favicon. [Jordan Dalton]

  Favicon is now a nicer image that make sense. Taken from: https://www.freefavicon.com/freefavicons/objects/iconinfo/map-pin-152-195874.html
- Update alert system. [Jordan Dalton]

  Alerts now use a library instead of the custom-built one. It's much better and smoother :P


v2.2.8 (04-03-2018)
-------------------

New
~~~
- Added overlays. [Jordan Dalton]

  Overlays, Overlays, Overlays!

  So, the map images now have a street overlay folder that is, well, overlayed onto the over images. Woo. So, now you don't need to send the street names with the player data.. Well, if you still want that you can.

  Just make sure to download the latest image release, and pop them into your map folder.
- Add dynamic blip controls. [Jordan Dalton]

  Blip controls are now created and popped into the right div when the webapp is navigated to.

  Still need to implement the actual behaviour.
- Add version to title. [Jordan Dalton]

  The webapp now displays the current version next to it's name. E.g. "Live Map v2.2.7"
- Add temporary favicon. [Jordan Dalton]

  Added a temp favicon for the webpage.
- Add dynamic blip CSS. [Jordan Dalton]

  Blip images for use in HTML is dynamically created in the generateBlipShit function in "markers.js". Since there's a load of blips, I felt dynamically creating them would be better than sitting down for two hours and manually putting them in. It doesn't take into account the other marker types (yet).

Changes
~~~~~~~
- Update to latest development. [Jordan Dalton]

  I can't remember what I changed but, something has so...
- Update dropdown CSS. [Jordan Dalton]

  Dropdowns now comply with the dark theme
- Update sidebar to be more mobile friendly. [Jordan Dalton]

  Before the sidebar wasn't very nice on smaller devices such as mobiles. This change should fix this. This also means that the map takes up the full webpage and users need to click the "Hide/Show Controls" button before they can see the controls.
- Update alerts. [Jordan Dalton]

  Alerts can now be scrolled though

Fix
~~~
- Fixed map background. [Jordan Dalton]

  Background for the map now changed with the map instead of staying the same colour.
- Fixed alert holder width. [Jordan Dalton]

  The new alert holder would cut off alerts on smaller screens. Should be fixed now.

Other
~~~~~
- Removed street overlay.. [Jordan Dalton]

  They didn't work.
- Forgot to change the debug value back to false. [Jordan Dalton]
- Upate to v2.2.8. [Jordan Dalton]
- Removed servers.php. [Jordan Dalton]

  The server array is now in the config.


v2.2.7 (13-12-2017)
-------------------

New
~~~
- Add server selection. [Jordan Dalton]

  Users can now select a server to view, if you have multiple servers to show.

  I will update the readme to reflect these changes but, the easiest way to get this working is to add a empty array to the servers file with a name of your choice.

Changes
~~~~~~~
- Update changelog. [Jordan Dalton]
- Update to v2.2.7. [Jordan Dalton]
- Update readme. [Jordan Dalton]
- Update navbar. [Jordan Dalton]

  Navbar now has stuff in it... Well, it _will_ do when I add them.
- Update style. [Jordan Dalton]

  Bootstrap 4 was released so, I thought I'd give it a try. With this, I've had to update the style of the interface.

  The interface is now fully dark. This means the navigation elements (mainly the sidebar and navbar) is now dark.

  Labels have changed... Well, bootstrap have renamed them to "badges" so, I've been forced to call them the same.

  I've re-done the sidebar so, it no longer uses lists. It's just plain 'ol links.

  Alerts are now just a solid color instead of a gradient.. Ew, who likes gradients anyways?

Fix
~~~
- Fixed socket label not using bootstrap 4. [Jordan Dalton]

  Socket label was updated to "badge" as per the new bootstrap system.


v0.2 (24-11-2017)
-----------------

New
~~~
- Added map type for postcode map. [Jordan Dalton]

  As soon as davwheat sends me the map, I will upload the images. This update just gets the interface for said images.
- Add "alerter" [Jordan Dalton]

  A JavaScript file to help easily create alerts from Bootstrap.
  Update minifier and add bootstrap lib

  Minifer adds the new alerter file.

  Bootstrap lib has been added to allow for alerts.

Changes
~~~~~~~
- Update to v2.2.6. [Jordan Dalton]
- Update stuff to use new alerts. [Jordan Dalton]

  Socket errors are now displayed in a alert (if debug is abled).

  If the interface gets an error when trying to get blips, it's shown in an error.
- Update update system. [Jordan Dalton]

  Update system now uses the new alert system. I think it looks nicer.
- Change console.debug to console.log. [Jordan Dalton]

  debug doesn't seem to want to work for me so, I've reverted them to logs.


v2.2.5 (23-11-2017)
-------------------

New
~~~
- Add player names now sorted. [Jordan Dalton]

  Player names are now sorted in the drop down menu by their "name" attribute. This mean "aaa" will appear at the top and, "zzz" will appear at the bottom (woo).

Changes
~~~~~~~
- Update to v2.2.5. [Jordan Dalton]


v2.2.4 (22-11-2017)
-------------------

Changes
~~~~~~~
- Update to v2.2.4. [Jordan Dalton]

Fix
~~~
- Fixed socket not closing when reconnecting. [Jordan Dalton]

  When users clicked the reconnect button when connected, the old socket wasn't being closed.


v2.2.3 (20-11-2017)
-------------------

Changes
~~~~~~~
- Update to v2.2.3. [Jordan Dalton]

  Corrected logic order of getPlayerInfoHtml to show additional keys.

Other
~~~~~
- Corrected logic order of getPlayerInfoHtml to show additional keys.
  [Antony Cook]


v2.2.2 (20-11-2017)
-------------------

New
~~~
- Added debug setting. [Antony Cook]

Changes
~~~~~~~
- Update to v2.2.2. [Jordan Dalton]
- Changes boolean checks to use json_encode. [Antony Cook]

Other
~~~~~
- Identifying information is no longer displayed to the client when set
  to false. [Antony Cook]


v2.2.1 (02-11-2017)
-------------------

Changes
~~~~~~~
- Update changelog. [Jordan Dalton]

Fix
~~~
- Fix #8 "Show blips toggle breaks" [Jordan Dalton]

  The toggle was using the old structure for the blips, forgot to update it. Now it works :)


v2.2.0 (30-10-2017)
-------------------

New
~~~
- Add blip socket commands. [Jordan Dalton]

  Blips can now be added/updated and removed from the map from the socket server.

Changes
~~~~~~~
- Update version.json. [Jordan Dalton]

  Don't know why socket.js is in here but, apparently I foorgot to commit some changes.
- Update changelog. [Jordan Dalton]
- Update coordinates to 2dp. [Jordan Dalton]

  Player coordinates are now 2dp like other markers.
- Update init.js. [Jordan Dalton]

  Mainly changed Tabs to spaces.

  The blip structure has now been changed to include a "pos" object inside of the blip that contains the position. Makes stuff a bit nicer.
- Update tabs to spaces. [Jordan Dalton]

  Yea... I don't like having Tabs in Atom so, I've replaced them all with spaces >:)
  Also, changed the coordinates of the markers to 2dp instead of 4.
- Update _blips array. [Jordan Dalton]

  The blips array now reflects the structure of the blips that is in the resource.
- Update update_checker. [Jordan Dalton]

  Update checker now uses the local version.json file for checks.. Seems nicer this way.
- Update index.php. [Jordan Dalton]

Other
~~~~~
- Revert "Update index.php" [Jordan Dalton]

  This reverts commit c156139761328f13f472d0fbc3631e8f872d485a.


v2.1.3 (20-10-2017)
-------------------

Changes
~~~~~~~
- Update update_checker. [Jordan Dalton]

  Using the repo instead of Gist.. Hopefully this is better.

Other
~~~~~
- Create version.json. [Jordan Dalton]


v2.1.2 (20-10-2017)
-------------------

Changes
~~~~~~~
- Update update_checker. [Jordan Dalton]
- Changed readme extension. [Jordan Dalton]

  Github wouldn't render it correctly without it.

Fix
~~~
- Fixed false values in config error. [Jordan Dalton]

  Setting a variable to false in the config would screw up the interface... I hate PHP


v2.1.1 (20-10-2017)
-------------------

New
~~~
- Add README. [Jordan Dalton]

  Added a README to hopefully help new users figure out how to use this.
- Add update_checker. [Jordan Dalton]

  If an update is available, then some nice, red text appears to tell the user.
- Add changelog. [Jordan Dalton]

  Added a changelog
- Add classes. [Jordan Dalton]

  Pretty much everything is in a class now..

  Keeps thing organised (I hope).
- Add license. [Jordan Dalton]

  Added a license to the files and such. Get this bitch ready for release.

Changes
~~~~~~~
- Update changelog. [Jordan Dalton]

Other
~~~~~
- Removed echos. [Jordan Dalton]

  Left some echos in the PHP code from testing... They've been removed now.


v2.1.0 (20-10-2017)
-------------------

New
~~~
- Added parameter parsing. [Jordan Dalton]

  The interface now has parameters!!! Woo 🎊🎊

  All configurable variables are inside the `utils/config.php` file :)

Changes
~~~~~~~
- Update how you configure the webapp. [Jordan Dalton]

  All configuration stuff is now inside "utils/config.php".


v2.0.1 (22-09-2017)
-------------------

New
~~~
- Add .editorconfig. [AciD]

  - Added `.editorconfig` to standardize code formatting
  - Fixed formatting of neccesary files

Changes
~~~~~~~
- Update how playercount is calculated (Fixes #5) [Jordan Dalton]

  The previous way of calculating the player count apparently didn't work. Now when the player leaves the server, they're removed from the local cache. This is then used to get the player count.

Fix
~~~
- Fixed minifying issues. [Jordan Dalton]

  Setting "$debug" to false  now correctly minifies the JS code. Before, it would minify it but syntax errors (missing semicolons) would cause the code to not execute.
  I've also added final_newline to the editor config (I can't remember where but, I heard it's better to have them).
- Fixed minifying issues. [Jordan Dalton]

  There was some issues when using the minifier ($debug = false). They were caused by missing semicolons (don't ask). So, now minifying should work like a charm.


v2.0.0 (20-09-2017)
-------------------

New
~~~
- Add ajax request for blip data. [Jordan Dalton]

  Blips are not gotten from the server via ajax request to the URL that is set by the user.
- Added Google hack. [Jordan Dalton]

  This allows anyone to run the live map without having to get an API  key from Google (wohoo, freedom)
- Added runtime minifier. [Jordan Dalton]

  If "debug" is set to false in the index, the minifier script will minify the css and js code and insert it into the HTML page when it's requested (yey).

Changes
~~~~~~~
- Update for v2.1.1 of live_map. [Jordan Dalton]

  This fixes varrious stuff so that it can work with v2.1.1 of live_map
- Update marker names. [Jordan Dalton]

  Made it so that markers have a default name, just in case we can't get any from the ajax request.

Fix
~~~
- Fixed blips not working. [Jordan Dalton]

  Withg the previous commit, I forgot to change a few thiings. Now everything should be working fine.

Other
~~~~~
- Minor changes. [Jordan Dalton]

  Removed whitespace infront of a player's name.
  Removed some JS that wasn't needed.
  Updated websocket to use the "getPlayerData" stuff
- Dynamically generated MarkerTypes. [Jordan Dalton]

  Holy fuck.. This took a lot of manual labour just to type out the blips the map can use :(

  Anyways, the MarkerTypes should now be generated when the page is loaded, saves on hardcoding each and every blip (there's hundereds) plus, it should allow for people to easily change the sprite sheet if they want.


v0.1 (24-05-2017)
-----------------

New
~~~
- Add local jquery file back and various updates. [Jordan Dalton]

  I must have fucked something up last time I added the jquery js file.. It works now so, I've added it back.
  I've also moved the control functions into their own file
- Add player tracking. [Jordan Dalton]

  Users can now track players on the server.. Stalkers!
- Add caching for blips and player selection. [Jordan Dalton]

  Blips are now only downloaded when the user clicks "refresh" and when the app is first loaded.
  User can now select a player that is online to "track". Still need to implement tracking,
- Add some more markers. [Jordan Dalton]

  Added some more marker types to the interface
- Add minified js files. [Jordan Dalton]

  Javascript files have been minified and updated.
- Add toggle showing blips. [Jordan Dalton]

  Blips can now be toggled on and off. When off, only the player markers should be shown.
- Added link to IdentityRP. [Jordan Dalton]
- Add favicon. [Jordan Dalton]
- Add minified markers file. [Jordan Dalton]

  I think minified files are loaded quicker and the markers file is big so, it's now minified.
- Add index.php. [Jordan Dalton]

  The main page for the app
- Add sockets.js. [Jordan Dalton]

  This file handles the websocket connection.
  It also updates the player markers and blips received from the game server.
- Add app.js. [Jordan Dalton]

  Contains various JQuery plugins such as modernizer
- Add utils.js. [Jordan Dalton]

  The utils file mainly contains utility methods such as game coords to map coords
- Add objects.js. [Jordan Dalton]

  This file contains the various objects that the app will use.
- Add init file. [Jordan Dalton]

  The init file will handle the initialization of the map.
- Add styles. [Jordan Dalton]

  Added the CSS files for styling the app
- Add marker types. [Jordan Dalton]

  Marker types been added to allow the correctt type to have the correct image from the spritesheet.
- Added js for map related stuff. [Jordan Dalton]

  Initializes the maps, controls and events.
- Add uv-invert tiles. [Jordan Dalton]

  Added the images for the uv-ivert map.. I don't think it's going to be used but.. They're here anyways..
- Add satalite tiles. [Jordan Dalton]

  Added the images for the satalite mapp
- Add road tiles. [Jordan Dalton]

  Images for the road map
- Add more atlas tiles. [Jordan Dalton]

  I'm starting to dislike sourcetree.
- Add missing atlas tiles. [Jordan Dalton]

  I didn't commit all tiles.. Here's the rest of them
- Add atlas tiles. [Jordan Dalton]

  Images for the atlas map
- Add icons. [Jordan Dalton]

  Icons to show on the map have been added.

Changes
~~~~~~~
- Update to use minified bootstrap. [Jordan Dalton]
- Update minified javascript files. [Jordan Dalton]

  Minified javascript files have been updated to the latest version
- Update socket to use player identifiers. [Jordan Dalton]

  Localcache now uses the player identifier which, should be more unique than player names.
- Update socket url to identityrp. [Jordan Dalton]

  App now uses the identityrp secure websocket
- Update jail2 location. [Jordan Dalton]

  "jail2" was previously being rendered to a plane icon
- Update websocket to use SSL. [Jordan Dalton]
- Update UI. [Jordan Dalton]

  Updated the UI and changed some stuff to make the app run a bit better.
- Update script tags in index to show previous changes. [Jordan Dalton]
- Update tile handling. [Jordan Dalton]

  Map can now let user's pan anywhere, showing them the map again. Before the map would just disapear when panned too far.

Fix
~~~
- Fixed hiding blips hiding players and added vehicle blips. [Jordan
  Dalton]

  Before, when hiding all blips the player blips would also be hidden. They should now be shown when other blips are hidden.

  When a player enters a vehicle, their blip changes to the appropriate icon and the vehicle name is displayed.
- Fix HTML syntax errors. [Jordan Dalton]

  Had some small syntax errors, they didin't break anything but there was some errors in console.
- Fixed websocket. [Jordan Dalton]

  Apparently I committed a change that shouldn't have been committed... This fixes that commit.

Other
~~~~~
- Remove player in localcache. [Jordan Dalton]

  Wasn't really using it anyways..
- Apparently I can't use a local JQuery file... FML. [Jordan Dalton]
- I need to pay attention more.. [Jordan Dalton]
- I'm tired. [Jordan Dalton]

  Been working all night..
- Various fixes and changes. [Jordan Dalton]
- Remove images/map. [Jordan Dalton]

  Removed the image files..
- Moved unminified files to js/src. [Jordan Dalton]

  Unminified files are now in their own folder and should be used when developing.


