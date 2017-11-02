Changelog
=========


v2.2.1 (02-11-2017)
-------------------
- Fix #8 "Show blips toggle breaks" [Jordan Dalton]

  The toggle was using the old structure for the blips, forgot to update it. Now it works :)
- Merge branch 'develop' [Jordan Dalton]


v2.2.0 (30-10-2017)
-------------------

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
- Merge branch 'feature/live_blips' into develop. [Jordan Dalton]
- Add blip socket commands. [Jordan Dalton]

  Blips can now be added/updated and removed from the map from the socket server.
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

Fix
~~~
- Fixed false values in config error. [Jordan Dalton]

  Setting a variable to false in the config would screw up the interface... I hate PHP

Other
~~~~~
- Changed readme extension. [Jordan Dalton]

  Github wouldn't render it correctly without it.


v2.1.1 (20-10-2017)
-------------------

Changes
~~~~~~~
- Update changelog. [Jordan Dalton]

Other
~~~~~
- Merge branch 'feature/documentation' into develop. [Jordan Dalton]
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
- Removed echos. [Jordan Dalton]

  Left some echos in the PHP code from testing... They've been removed now.


v2.1.0 (20-10-2017)
-------------------

Changes
~~~~~~~
- Update how you configure the webapp. [Jordan Dalton]

  All configuration stuff is now inside "utils/config.php".

Other
~~~~~
- Merge branch 'feature/php-params' into develop. [Jordan Dalton]
- Added parameter parsing. [Jordan Dalton]

  The interface now has parameters!!! Woo 🎊🎊

  All configurable variables are inside the `utils/config.php` file :)


v2.0.1 (22-09-2017)
-------------------

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

Other
~~~~~
- Add .editorconfig. [AciD]

  - Added `.editorconfig` to standardize code formatting
  - Fixed formatting of neccesary files


v2.0.0 (20-09-2017)
-------------------

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
- Add ajax request for blip data. [Jordan Dalton]

  Blips are not gotten from the server via ajax request to the URL that is set by the user.
- Minor changes. [Jordan Dalton]

  Removed whitespace infront of a player's name.
  Removed some JS that wasn't needed.
  Updated websocket to use the "getPlayerData" stuff
- Dynamically generated MarkerTypes. [Jordan Dalton]

  Holy fuck.. This took a lot of manual labour just to type out the blips the map can use :(

  Anyways, the MarkerTypes should now be generated when the page is loaded, saves on hardcoding each and every blip (there's hundereds) plus, it should allow for people to easily change the sprite sheet if they want.
- Added Google hack. [Jordan Dalton]

  This allows anyone to run the live map without having to get an API  key from Google (wohoo, freedom)
- Added runtime minifier. [Jordan Dalton]

  If "debug" is set to false in the index, the minifier script will minify the css and js code and insert it into the HTML page when it's requested (yey).


v0.1 (24-05-2017)
-----------------

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
- Fixed websocket. [Jordan Dalton]

  Apparently I committed a change that shouldn't have been committed... This fixes that commit.

Other
~~~~~
- Remove player in localcache. [Jordan Dalton]

  Wasn't really using it anyways..
- Fix HTML syntax errors. [Jordan Dalton]

  Had some small syntax errors, they didin't break anything but there was some errors in console.
- Add local jquery file back and various updates. [Jordan Dalton]

  I must have fucked something up last time I added the jquery js file.. It works now so, I've added it back.
  I've also moved the control functions into their own file
- Apparently I can't use a local JQuery file... FML. [Jordan Dalton]
- I need to pay attention more.. [Jordan Dalton]
- I'm tired. [Jordan Dalton]

  Been working all night..
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
- Various fixes and changes. [Jordan Dalton]
- Add favicon. [Jordan Dalton]
- Remove images/map. [Jordan Dalton]

  Removed the image files..
- Moved unminified files to js/src. [Jordan Dalton]

  Unminified files are now in their own folder and should be used when developing.
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


