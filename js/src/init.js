function globalInit() {
    mapInit("map-canvas");
    startMarkers();
    initPage()
}

function initPage() {
    $(window).on("load resize", function() {
        $(".map-tab-content").height((($("#tab-content").height() - $(".page-title-1").height()) - ($("#map-overlay-global-controls").height() * 4.2)))
    })
}

function initMarkers(debugOnly) {
    if (debugOnly) {
        createMarker(false, true, new MarkerObject("@DEBUG@@Locator", new Coordinates(0, 500, 0), MarkerTypes[999], "", ""), "")
        console.log("MarkerType: " + MarkerTypes[999]);
    } else {
        createMarker(false, false, new MarkerObject("True Map Center", new Coordinates(0, 0, 0), MarkerTypes[6], "", ""), "");
    }
}
