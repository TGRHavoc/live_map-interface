# Changelog

## [4.0.0](https://github.com/TGRHavoc/live_map-interface/compare/v3.2.5...v4.0.0) (2019-06-09)


### Bug Fixes

* version error ([b71d894](https://github.com/TGRHavoc/live_map-interface/commit/b71d894))


### Changes

* remove values in config that are not needed anymore ([a37b31a](https://github.com/TGRHavoc/live_map-interface/commit/a37b31a))
* spelling mistake `identifer` -> `identifier` ([3bcad79](https://github.com/TGRHavoc/live_map-interface/commit/3bcad79))


### Features

* update init to use the new resource system ([56034e1](https://github.com/TGRHavoc/live_map-interface/commit/56034e1))


### BREAKING CHANGES

* spelling mistake `identifer` -> `identifier`



### [3.2.5](https://github.com/TGRHavoc/live_map-interface/compare/v3.2.4...v3.2.5) (2019-05-17)


### Changes

* remove images/map folder ([87e8696](https://github.com/TGRHavoc/live_map-interface/commit/87e8696))


### Features

* add default marker icons ([9e11285](https://github.com/TGRHavoc/live_map-interface/commit/9e11285))
* add fire station and flame icons to markers ([0769907](https://github.com/TGRHavoc/live_map-interface/commit/0769907))



### [3.2.4](https://github.com/TGRHavoc/live_map-interface/compare/v3.2.3...v3.2.4) 


### Bug Fixes

* duplicate players in player list ([c4cd605](https://github.com/TGRHavoc/live_map-interface/commit/c4cd605)), closes [#33](https://github.com/TGRHavoc/live_map-interface/issues/33) [#33](https://github.com/TGRHavoc/live_map-interface/issues/33)



### [3.2.3](https://github.com/TGRHavoc/live_map-interface/compare/v3.2.0...v3.2.3) 


### Changes

* remove random print from control file ([2910f2a](https://github.com/TGRHavoc/live_map-interface/commit/2910f2a))
* update changeServer to reset controls ([46e42b3](https://github.com/TGRHavoc/live_map-interface/commit/46e42b3)), closes [#33](https://github.com/TGRHavoc/live_map-interface/issues/33)
* update marker accuracy ([50ee202](https://github.com/TGRHavoc/live_map-interface/commit/50ee202))


### Features

* add "groupPlayers" to config ([ee2b957](https://github.com/TGRHavoc/live_map-interface/commit/ee2b957)), closes [#32](https://github.com/TGRHavoc/live_map-interface/issues/32) [#32](https://github.com/TGRHavoc/live_map-interface/issues/32)
* add a stiched image of the normal tileset ([8fedeba](https://github.com/TGRHavoc/live_map-interface/commit/8fedeba))



## [3.2.0](https://github.com/TGRHavoc/live_map-interface/compare/v3.0.0...v3.2.0) 


### Bug Fixes

* blip controls breaking when switching servers ([b15938f](https://github.com/TGRHavoc/live_map-interface/commit/b15938f))
* leaflet error in production ([3301a68](https://github.com/TGRHavoc/live_map-interface/commit/3301a68))
* nav item's class. ([e19a93b](https://github.com/TGRHavoc/live_map-interface/commit/e19a93b))
* player clusters not being clickable ([aaa159a](https://github.com/TGRHavoc/live_map-interface/commit/aaa159a))
* popup flickering on players ([0149d21](https://github.com/TGRHavoc/live_map-interface/commit/0149d21))


### Changes

* increase marker accuracy ([878ee15](https://github.com/TGRHavoc/live_map-interface/commit/878ee15))
* move fonts ([1920cf3](https://github.com/TGRHavoc/live_map-interface/commit/1920cf3))
* rename pre-push to post-commit ([d1cc408](https://github.com/TGRHavoc/live_map-interface/commit/d1cc408))
* update bootstrap to 4.1.3 ([2c5359f](https://github.com/TGRHavoc/live_map-interface/commit/2c5359f))
* update font paths back to relative ([e65f4b0](https://github.com/TGRHavoc/live_map-interface/commit/e65f4b0))


### Features

* add clustering player icons ([c162950](https://github.com/TGRHavoc/live_map-interface/commit/c162950))
* add defaults to config ([f393b91](https://github.com/TGRHavoc/live_map-interface/commit/f393b91))
* add new console._log function ([493ba08](https://github.com/TGRHavoc/live_map-interface/commit/493ba08))
* add player filtering ([3c3780c](https://github.com/TGRHavoc/live_map-interface/commit/3c3780c))
* add utils/config.html ([4ccebec](https://github.com/TGRHavoc/live_map-interface/commit/4ccebec))



## [3.0.0](https://github.com/TGRHavoc/live_map-interface/compare/v2.2.11...v3.0.0) 


### Bug Fixes

* accuracy issues in the map markers ([9449dec](https://github.com/TGRHavoc/live_map-interface/commit/9449dec))
* config defaults when loading config ([0b7ef8d](https://github.com/TGRHavoc/live_map-interface/commit/0b7ef8d))
* controls being disabled on zoom ([f550b78](https://github.com/TGRHavoc/live_map-interface/commit/f550b78))
* controls not working with leaflet ([efc8913](https://github.com/TGRHavoc/live_map-interface/commit/efc8913)), closes [#20](https://github.com/TGRHavoc/live_map-interface/issues/20)


### Changes

* add tiles used during development ([2a01e44](https://github.com/TGRHavoc/live_map-interface/commit/2a01e44))
* changed bundler software ([6afa8d4](https://github.com/TGRHavoc/live_map-interface/commit/6afa8d4))
* moved vendor files into a vendor folder ([7d82699](https://github.com/TGRHavoc/live_map-interface/commit/7d82699))
* moved version check to JS ([4255667](https://github.com/TGRHavoc/live_map-interface/commit/4255667))
* remove php utility files ([8a279d1](https://github.com/TGRHavoc/live_map-interface/commit/8a279d1))
* update files to use new config.json file ([618bc39](https://github.com/TGRHavoc/live_map-interface/commit/618bc39))
* update font-awesome fonts ([ac76737](https://github.com/TGRHavoc/live_map-interface/commit/ac76737))
* update js names for new build system ([d52ed41](https://github.com/TGRHavoc/live_map-interface/commit/d52ed41))
* update map utils for better accuracy with new framework ([792cfbb](https://github.com/TGRHavoc/live_map-interface/commit/792cfbb))
* update scripts to use new global variables ([213a1e0](https://github.com/TGRHavoc/live_map-interface/commit/213a1e0))
* update static markers to new map ([8d7c2d6](https://github.com/TGRHavoc/live_map-interface/commit/8d7c2d6))
* update utils to new map ([096e84e](https://github.com/TGRHavoc/live_map-interface/commit/096e84e))
* update webpack config to match previous PHP minifier ([d6367be](https://github.com/TGRHavoc/live_map-interface/commit/d6367be))


### Features

* add bundler configs ([ffec536](https://github.com/TGRHavoc/live_map-interface/commit/ffec536))
* add font-awesome css ([75e1714](https://github.com/TGRHavoc/live_map-interface/commit/75e1714))
* add git pre-push hook ([77c3e39](https://github.com/TGRHavoc/live_map-interface/commit/77c3e39))
* add leaflet.js framework ([dd0f7c0](https://github.com/TGRHavoc/live_map-interface/commit/dd0f7c0))
* add python files used to extract PNGs from YTD files ([d23bec2](https://github.com/TGRHavoc/live_map-interface/commit/d23bec2))
* add reverse proxy config ([05c8f99](https://github.com/TGRHavoc/live_map-interface/commit/05c8f99))
* add stripJsonOfComments to utils ([cce1009](https://github.com/TGRHavoc/live_map-interface/commit/cce1009))
* moved from php to html ([8f95d87](https://github.com/TGRHavoc/live_map-interface/commit/8f95d87))
* update map code with better zooming ([9a3cfd8](https://github.com/TGRHavoc/live_map-interface/commit/9a3cfd8))



### [2.2.11](https://github.com/TGRHavoc/live_map-interface/compare/v2.2.10...v2.2.11) 


### Bug Fixes

* update alerts ([65a401d](https://github.com/TGRHavoc/live_map-interface/commit/65a401d))



### [2.2.10](https://github.com/TGRHavoc/live_map-interface/compare/v2.2.9...v2.2.10) 


### Bug Fixes

* blip icons not working on other servers ([e8f5fa6](https://github.com/TGRHavoc/live_map-interface/commit/e8f5fa6))



### [2.2.9](https://github.com/TGRHavoc/live_map-interface/compare/v2.2.8...v2.2.9) 


### Bug Fixes

* remove street overlay ([9d2d740](https://github.com/TGRHavoc/live_map-interface/commit/9d2d740))


### Changes

* update favicon ([b15ccbe](https://github.com/TGRHavoc/live_map-interface/commit/b15ccbe))


### Features

* add alert library ([44984a3](https://github.com/TGRHavoc/live_map-interface/commit/44984a3))
* add blip controls ([4b712dd](https://github.com/TGRHavoc/live_map-interface/commit/4b712dd))



### [2.2.8](https://github.com/TGRHavoc/live_map-interface/compare/v2.2.7...v2.2.8) 


### Bug Fixes

* alert holder width ([bdd446e](https://github.com/TGRHavoc/live_map-interface/commit/bdd446e))
* map background colour ([4eea576](https://github.com/TGRHavoc/live_map-interface/commit/4eea576))


### Changes

* remove servers.php ([6e71478](https://github.com/TGRHavoc/live_map-interface/commit/6e71478))
* update dropdown CSS ([4e59a15](https://github.com/TGRHavoc/live_map-interface/commit/4e59a15))
* update sidebar to be more mobile friendly ([a4e0ed5](https://github.com/TGRHavoc/live_map-interface/commit/a4e0ed5))
* update to latest development commit ([36b12c8](https://github.com/TGRHavoc/live_map-interface/commit/36b12c8))


### Features

* add dynamic blip controls ([ea37d41](https://github.com/TGRHavoc/live_map-interface/commit/ea37d41))
* add dynamic blip CSS ([b0d64aa](https://github.com/TGRHavoc/live_map-interface/commit/b0d64aa))
* add overlays ([cfdedc9](https://github.com/TGRHavoc/live_map-interface/commit/cfdedc9))
* add scrollable alerts ([e24c1a5](https://github.com/TGRHavoc/live_map-interface/commit/e24c1a5))
* add temporary favicon ([d39e318](https://github.com/TGRHavoc/live_map-interface/commit/d39e318))
* add version to title ([2be07f8](https://github.com/TGRHavoc/live_map-interface/commit/2be07f8))



### [2.2.7](https://github.com/TGRHavoc/live_map-interface/compare/v2.2.6...v2.2.7) 


### Bug Fixes

* socket label not using bootstrap 4 ([1214e97](https://github.com/TGRHavoc/live_map-interface/commit/1214e97))


### Changes

* update navbar ([10df12b](https://github.com/TGRHavoc/live_map-interface/commit/10df12b))
* update style of webapp ([5caac87](https://github.com/TGRHavoc/live_map-interface/commit/5caac87))


### Features

* add server selection ([07e9abd](https://github.com/TGRHavoc/live_map-interface/commit/07e9abd))



### [2.2.6](https://github.com/TGRHavoc/live_map-interface/compare/v2.2.5...v2.2.6) 


### Changes

* change console.debug to console.log ([5e97c24](https://github.com/TGRHavoc/live_map-interface/commit/5e97c24))
* update various files to use new alerts ([69a9d96](https://github.com/TGRHavoc/live_map-interface/commit/69a9d96))


### Features

* add "alerter" ([9ae0131](https://github.com/TGRHavoc/live_map-interface/commit/9ae0131))
* added map type for postcode map ([f7b7bad](https://github.com/TGRHavoc/live_map-interface/commit/f7b7bad))
* modify the update system ([0cb72c5](https://github.com/TGRHavoc/live_map-interface/commit/0cb72c5))



### [2.2.5](https://github.com/TGRHavoc/live_map-interface/compare/v2.2.4...v2.2.5) 


### Features

* add sorted player names ([5f2611c](https://github.com/TGRHavoc/live_map-interface/commit/5f2611c))



### [2.2.4](https://github.com/TGRHavoc/live_map-interface/compare/v2.2.3...v2.2.4) 


### Bug Fixes

* socket not closing when reconnecting ([5e3eaee](https://github.com/TGRHavoc/live_map-interface/commit/5e3eaee))



### [2.2.3](https://github.com/TGRHavoc/live_map-interface/compare/v2.2.2...v2.2.3) 


### Bug Fixes

* logic inside getPlayerInfoHtml ([5d8561f](https://github.com/TGRHavoc/live_map-interface/commit/5d8561f))



### [2.2.2](https://github.com/TGRHavoc/live_map-interface/compare/v2.2.1...v2.2.2) 


### Features

* add debug setting ([c78ca8b](https://github.com/TGRHavoc/live_map-interface/commit/c78ca8b))
* change boolean checks to use json_encode ([8769f19](https://github.com/TGRHavoc/live_map-interface/commit/8769f19))
* dont show information when config is set to false ([91e6a53](https://github.com/TGRHavoc/live_map-interface/commit/91e6a53))



### [2.2.1](https://github.com/TGRHavoc/live_map-interface/compare/v2.2.0...v2.2.1) 


### Bug Fixes

* 'show blips' button breaks ([e625b5e](https://github.com/TGRHavoc/live_map-interface/commit/e625b5e)), closes [#8](https://github.com/TGRHavoc/live_map-interface/issues/8)



## [2.2.0](https://github.com/TGRHavoc/live_map-interface/compare/v2.1.3...v2.2.0) 


### Changes

* update _blips array ([7c1a067](https://github.com/TGRHavoc/live_map-interface/commit/7c1a067))


### Features

* add blip socket commands ([5644a00](https://github.com/TGRHavoc/live_map-interface/commit/5644a00))
* update coordinates to 2dp ([e9f0ddf](https://github.com/TGRHavoc/live_map-interface/commit/e9f0ddf))



### [2.1.3](https://github.com/TGRHavoc/live_map-interface/compare/v2.1.2...v2.1.3) 


### Bug Fixes

* false values in config error ([8c9c5cf](https://github.com/TGRHavoc/live_map-interface/commit/8c9c5cf))


### Changes

* update update_checker to use new versioning system ([411aea7](https://github.com/TGRHavoc/live_map-interface/commit/411aea7))



### [2.1.2](https://github.com/TGRHavoc/live_map-interface/compare/v2.1.1...v2.1.2) 


### Changes

* add classes ([50230f3](https://github.com/TGRHavoc/live_map-interface/commit/50230f3))


### Features

* add update_checker ([5e81393](https://github.com/TGRHavoc/live_map-interface/commit/5e81393))



### [2.1.1](https://github.com/TGRHavoc/live_map-interface/compare/v2.1.0...v2.1.1) 


### Changes

* remove echos ([ef7d945](https://github.com/TGRHavoc/live_map-interface/commit/ef7d945))
* update how you configure the webapp ([e26f1d6](https://github.com/TGRHavoc/live_map-interface/commit/e26f1d6))


### Features

* add parameter parsing ([7ca40f2](https://github.com/TGRHavoc/live_map-interface/commit/7ca40f2))



## [2.1.0](https://github.com/TGRHavoc/live_map-interface/compare/v2.0.0...v2.1.0) 


### Bug Fixes

* minifying issues ([615b0e9](https://github.com/TGRHavoc/live_map-interface/commit/615b0e9))
* minifying issues ([962f828](https://github.com/TGRHavoc/live_map-interface/commit/962f828))
* playercount miscalculation ([59d3c43](https://github.com/TGRHavoc/live_map-interface/commit/59d3c43)), closes [#5](https://github.com/TGRHavoc/live_map-interface/issues/5)



## [2.0.0](https://github.com/TGRHavoc/live_map-interface/compare/143cac5...v2.0.0) 


### Bug Fixes

* blips not working ([f43cf75](https://github.com/TGRHavoc/live_map-interface/commit/f43cf75))
* hiding blips also hiding players ([7d665cd](https://github.com/TGRHavoc/live_map-interface/commit/7d665cd))
* html syntax errors ([a318344](https://github.com/TGRHavoc/live_map-interface/commit/a318344))
* live_map v2.1.1 intergration ([b04bcb4](https://github.com/TGRHavoc/live_map-interface/commit/b04bcb4))
* websocket being broken ([db6bd45](https://github.com/TGRHavoc/live_map-interface/commit/db6bd45))


### Changes

* add favicon ([2af6895](https://github.com/TGRHavoc/live_map-interface/commit/2af6895))
* add minified js files ([ab3fc9d](https://github.com/TGRHavoc/live_map-interface/commit/ab3fc9d))
* remove images/map ([66fbfdb](https://github.com/TGRHavoc/live_map-interface/commit/66fbfdb))
* remove player in localcache ([c840e09](https://github.com/TGRHavoc/live_map-interface/commit/c840e09))
* update marker names ([fc526f2](https://github.com/TGRHavoc/live_map-interface/commit/fc526f2))
* update minified javascript files ([c83bb54](https://github.com/TGRHavoc/live_map-interface/commit/c83bb54))
* update to use minified bootstrap ([354d176](https://github.com/TGRHavoc/live_map-interface/commit/354d176))
* update UI ([72756e8](https://github.com/TGRHavoc/live_map-interface/commit/72756e8))
* various changes to make code more readable ([f24ade7](https://github.com/TGRHavoc/live_map-interface/commit/f24ade7))
* various fixes and changes ([864e886](https://github.com/TGRHavoc/live_map-interface/commit/864e886))


### Features

* add ajax request for blip data ([6ab06c5](https://github.com/TGRHavoc/live_map-interface/commit/6ab06c5))
* add caching for blips and player selection ([47be19a](https://github.com/TGRHavoc/live_map-interface/commit/47be19a))
* add dynamically generated MarkerTypes ([9f270b1](https://github.com/TGRHavoc/live_map-interface/commit/9f270b1))
* add Google hack for maps ([35021ee](https://github.com/TGRHavoc/live_map-interface/commit/35021ee))
* add link to IdentityRP ([167d0d3](https://github.com/TGRHavoc/live_map-interface/commit/167d0d3))
* add player tracking ([186b254](https://github.com/TGRHavoc/live_map-interface/commit/186b254))
* add runtime minifier ([c020a34](https://github.com/TGRHavoc/live_map-interface/commit/c020a34))
* add some more markers ([b4cc119](https://github.com/TGRHavoc/live_map-interface/commit/b4cc119))
* add toggle showing blips ([45ebb37](https://github.com/TGRHavoc/live_map-interface/commit/45ebb37))
* ssl in websocket ([28c5347](https://github.com/TGRHavoc/live_map-interface/commit/28c5347))
* update jail2 icon ([a56c13e](https://github.com/TGRHavoc/live_map-interface/commit/a56c13e))
* update script tags in index to show previous changes ([143cac5](https://github.com/TGRHavoc/live_map-interface/commit/143cac5))
* update socket to use player identifiers ([fe379a4](https://github.com/TGRHavoc/live_map-interface/commit/fe379a4))
* update socket url to identityrp ([85f4298](https://github.com/TGRHavoc/live_map-interface/commit/85f4298))
