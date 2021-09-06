import "@testing-library/jest-dom";

export const DOCUMENT_BODY = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Havoc's LiveMap</title>

    <!-- Pin favicon from: https://www.freefavicon.com/freefavicons/objects/iconinfo/map-pin-152-195874.html -->
    <link
        href="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP74zAv++Mwn/vjMMf74zDH++Mwm//jMCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD++c0d/vnNROPLnGDw4bRX/vnNQ/75zRkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFKwBThSsAQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACFLQABhSwAvIUsAKyGLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhS0AYYUtAP+FLQD+hS0AUgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACGLgAAhi4AYYUtAPmFLQD/hS0A/4UtAPWGLgBVhi4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHLwABhi4AkoUuAP+MMQD/uEQA/7ZDAP+LMAD/hS4A/oYuAIONNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhzAAWoYvAP/DTQD//8Ay///mSP//5Uj//7ov/7dHAP+FLwD+hi8ASgAAAAAAAAAAAAAAAAAAAAAAAAAAiC0AAIYwAM2UNgD//888///pS///6Uv//+lL///pS///xjf/jTMA/4UwAL0AAAAAAAAAAAAAAAAAAAAAAAAAAIYxAAmGMAD66WQN///qTP//6Uz//+lM///pTP//6Uz//+pM/9NYCP+FMADxhTAAAwAAAAAAAAAAAAAAAAAAAACFMQALhTEA/PduE///6k3//+pN///qTf//6k3//+pN///qTf/iYg7/hTEA84MxAAMAAAAAAAAAAAAAAAAAAAAAhDEAAYQxANemQwH//+RK///qTf//6k3//+pN///qTf//30j/mjwA/4UxAMcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEMgBshDEA//93Gf//50z//+tO///rTv//5Ev/8W0V/4QxAP+EMgBbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgzIAA4MyAK+CMQD/tEwH//+AH///fh7/rUgF/4IxAP+BMQCggDEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACDMgAEgjIAc4MyAOCDMgD+gzIA/oEyANyCMgBqgDEAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+MAACgTIAFn4xABV/MQABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+B8AAPgfAAD+fwAA/D8AAPw/AADwDwAA4AcAAOAHAADABwAAwAMAAMADAADABwAA4AcAAOAHAADwDwAA/D8AAA=="
        rel="icon" type="image/x-icon">

    <link type="text/css" rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700">

    <!-- Vendor Stylesheets -->
    <link rel="stylesheet" href="style/vendor/leaflet.css" />
    <link rel="stylesheet" href="style/vendor/all.css" />
    <link rel="stylesheet" href="style/vendor/MarkerCluster.css" />

    <!-- Custom stylesheet-->
    <link rel="stylesheet" href="style/src/style.css" />

    <!-- Vendor JS -->
    <!-- They only have a letter in front of them because, I cba adding vendors to gulpfile manually.
        I'd rather just add a JS file and be good to go.
    -->
    <script src="js/vendor/a_leaflet.js"></script>
    <script src="js/vendor/b_bootstrap.js"></script>
    <script src="js/vendor/e_leaflet.markercluster-src.js"></script>
    <script src="js/vendor/simple-notify.js"></script>

    <!-- Custom JS files -->
    <script src="js/src/_app.js" type="module"></script>
</head>

<body>
    <header>
        <nav class="navbar navbar-expand-md navbar-dark" aria-label="Main navbar for LiveMap">
            <div class="container">
                <a class="navbar-brand" href="#">
                    <img src="images/profile.png" style="max-height: 32px">
                    Live Map v<span id="livemapVersion">0.0.0</span>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar"
                    aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="mainNavbar">
                    <ul class="navbar-nav me-auto mb-2 mb-md-0">

                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="selectServerMenuDropdown"
                                data-bs-toggle="dropdown" aria-expanded="false" data-i18n="navbar.select-server">
                                Select a server
                            </a>
                            <ul id="serverMenu" class="dropdown-menu" aria-labelledby="selectServerMenuDropdown">
                            </ul>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" role="button" id="sidebarTooggle" data-bs-toggle="modal"
                                data-bs-target="#controlsModal" data-i18n="navbar.controls">
                                Show Controls
                            </a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" role="button" id="blipToggle" data-bs-toggle="modal"
                                data-bs-target="#blipsControlModal" data-i18n="navbar.blips">
                                Blip controls
                            </a>
                        </li>

                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="selectLanguageDropdown"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <span data-i18n="navbar.language">Language</span> <span id="currentLang"
                                    class="badge bg-info">en</span>
                            </a>
                            <ul id="availableLanguages" class="dropdown-menu" aria-labelledby="selectLanguageDropdown">
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    <!-- Control modals. Best way I can think of getting the controls to be nice on mobile -->

    <!-- Controls modal -->
    <div class="modal fade show" id="controlsModal" tabindex="-1" aria-labelledby="controlsModalTitle" aria-modal="true"
        role="dialog">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="controlsModalTitle" data-i18n="controls.title controls.title"
                        data-i18n-attr="aria-label innerText">Controls</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" data-i18n="generic.close"
                        data-i18n-attr="aria-label" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <!-- Blip controls -->
                    <div class="list-group border-0 text-center" style="padding: 8px 0;">
                        <h4 class="control-header" data-i18n="controls.blips.title">Blips</h4>
                        <a class="list-group-item" id="refreshBlips" href="#" data-i18n="controls.blips.refresh">
                            Refresh Blips
                        </a>

                        <a id="showBlips" href="#" class="list-group-item">
                            <span data-i18n="controls.blips.show">Show Blips</span>
                            <span data-i18n="generic.on" id="blipsEnabled" class="badge bg-success">on</span>
                        </a>
                    </div>
                    <!-- end blip controls -->

                    <hr />

                    <!-- Connection controls -->
                    <div class="list-group border-0 text-center">
                        <h4 class="control-header" data-i18n="controls.connection.title">Connection</h4>

                        <!-- <a id="toggleLive" class="list-group-item" href="#">
                            <span data-i18n="controls.connection.live-update">Live update</span>
                            <span data-i18n="generic.off" id="liveEnabled" class="badge bg-danger">off</span>
                        </a> -->

                        <a id="reconnect" href="#" class="list-group-item">
                            <span class="d-md-inline" data-i18n="controls.connection.reconnect">Connect</span>
                            <span id="connection" class="badge bg-danger"
                                data-i18n="generic.disconnected">disconnected</span>
                        </a>
                    </div>
                    <!-- end connection controls -->

                    <hr />

                    <div class="list-group border-0 text-center">
                        <h4 class="control-header" data-i18n="controls.information.title">Information</h4>

                        <a class="list-group-item ">
                            <span data-i18n="controls.information.viewing">Currently viewing</span>:
                            <p id="serverName" class="text-info">
                                No server loaded
                            </p>
                        </a>

                        <a class="list-group-item ">
                            <span data-i18n="controls.information.blips-loaded">Blips loaded</span>
                            <span id="blipCount" class="badge bg-info">0</span>
                        </a>

                        <a class="list-group-item">
                            <span data-i18n="controls.information.players">Online players</span>
                            <span id="playerCount" class="badge bg-info">0</span>
                        </a>
                    </div>

                    <hr />

                    <div class="list-group border-0 text-center">
                        <a class="list-group-item d-inline-block collapsed">
                            <h6 class="control-header" data-i18n="controls.track-player.title">Track Player</h6>

                            <select id="playerSelect" class="input-large form-control text-danger">
                                <option value="" data-i18n="controls.track-player.disable" class="text-muted" selected>
                                    Stop tracking
                                </option>
                            </select>
                        </a>
                    </div>
                    <hr />

                    <div class="list-group border-0 text-center">
                        <a class="list-group-item d-inline-block collapsed">
                            <h6 class="control-header" data-i18n="controls.filter.title">Filter</h6>

                            <select id="filterOn" class="input-large form-control text-danger">
                                <option value="" data-i18n="controls.filter.disable-filter" class="text-muted" selected>
                                    Disable filter
                                </option>
                            </select>
                            <span data-i18n="controls.filter.filter-value">With a value of: </span>
                            <input data-i18n="controls.filter.filter-placeholder" data-i18n-attr="placeholder"
                                type="text" id="onlyShow" class="input-large form-control" placeholder="Something" />
                        </a>
                    </div>


                    <hr />

                    <div class="list-group border-0 card text-center text-md-left" style="margin-top: 10px;">
                        <p style="text-align: center;">
                            <span data-i18n="credit">This was originally created by </span>
                            <a href="https://github.com/TGRHavoc">Havoc</a>
                        </p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        data-i18n="generic.close">Close</button>
                </div>
            </div>
        </div>
    </div>
    <!-- end controls modal -->

    <!-- Blip control modal -->
    <div class="modal fade show" id="blipsControlModal" tabindex="-1" aria-labelledby="blipsControlModalTitle"
        aria-modal="true" role="dialog">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="blipsControlModalTitle"
                        data-i18n="blip-controls.title blip-controls.title" data-i18n-attr="aria-label innerText">Blip
                        Controls</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" data-i18n="generic.close"
                        data-i18n-attr="aria-label" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="blipFilterDropdown" class="custom-menu col-sm-0 col-xs-0 col-md-12">
                        <div class="list-group border-0 card text-center text-md-left" style="padding: 8px 0;">

                            <a id="toggleAllBlips" class="btn btn-sm btn-info" data-i18n="blip-controls.toggle">Toggle
                                all</a>

                            <div id="blipControlContainer" style="margin-top: 1em;">

                            </div>

                        </div>

                        <hr />
                        <div class="list-group border-0 card text-center text-md-left" style="margin-top: 10px;">
                            <p style="text-align: center;">
                                <span data-i18n="credit">This was originally created by </span>
                                <a href="https://github.com/TGRHavoc">Havoc</a>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                        data-i18n="generic.close">Close</button>
                </div>
            </div>
        </div>
    </div>


    <!-- End of modals -->
    <div id="wrapper" class="container-fluid" style="padding: 0;">
        <main id="mapContainer">
            <div id="mapCanvas"></div>
        </main>
    </div>

    <script>
    </script>
</body>

</html>
`;

// Reset the HTML before each test
beforeEach(() => {
    document.body.innerHTML = DOCUMENT_BODY;
})
