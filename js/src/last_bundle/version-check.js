$(document).ready(function () {
    $.ajax("version.json", {
        error: function (textStatus, errorThrown) {
            createAlert({
                title: "<strong>Error getting version.json!</strong>",
                message: textStatus.statusText
            });
        },
        dataType: "text", // We want to strip any comments in the file first
        success: function (data, textStatus) {
            var str = stripJsonOfComments(data);
            var p = JSON.parse(str);

            window.version = p["interface"];

            $("#livemap_version").text(window.version); // Show it on the interface

            $.ajax("https://raw.githubusercontent.com/TGRHavoc/live_map-interface/master/version.json", {
                error: function (textStatus, errorThrown) {
                    createAlert({
                        title: "<strong>Error latest version for check!</strong>",
                        message: textStatus.statusText
                    });
                },
                dataType: "text", // We want to strip any comments in the file first
                success: function (data, textStatus) {
                    var str = stripJsonOfComments(data);
                    var p = JSON.parse(str);

                    // Check versions
                    if (window.compareVersions(window.version, p["interface"]) < 0){
                        createAlert({
                            title: "Update available",
                            message: `An update is available (${window.version} -> ${p["interface"]}). Please download it <a style='color: #000;' href='https://github.com/TGRHavoc/live_map-interface'>HERE.</a>`
                        })
                    }else{
                        console._log("Up to date or, a higher version");
                    }

                }
            });
        }
    });
});

/*
        $jsArrayString = sprintf("An update is available (%s -> %s). Please download it <a style=\'color: #000;\' href=\'%s\'>HERE.</a>", self::$version, self::$latestVer, self::$downloadUrl);

        return "<script> createAlert({ title: 'Update available', message: '" . $jsArrayString . "'}, {type: 'danger', delay: 0}); </script>";
*/
