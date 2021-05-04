class VersionCheck {

    constructor(){
        this.versionFile = "version.json";
        this.currentVersion = "0.0.0";
        this.remoteVersion = "4.0.0";
        this.remoteVersionUrl = "https://raw.githubusercontent.com/TGRHavoc/live_map-interface/master/version.json";
    }

    updateInterface(){
        document.getElementById("livemap_version").textContent = this.currentVersion;
    }

    /**
     * 
     * @param {function} nextFucntionIfSuccessfull The function to call if we got the current version
     */
    getCurrentVersion(nextFucntionIfSuccessfull){
        const _ = this;
        Requester.sendRequestTo(_.versionFile, function(request){
            var data = JSON.parse(JsonStrip.stripJsonOfComments(request.responseText));
            _.currentVersion = data.interface;
            
            if (nextFucntionIfSuccessfull != null) nextFucntionIfSuccessfull();
        }, function(request){
            Alerter.createAlert({status: "error", text: `Got response ${request.status} from server.`});
        });
    }

    getRemoteVersion(nextFucntionIfSuccessfull){
        const _ = this;
        Requester.sendRequestTo(_.remoteVersionUrl, function(request){
            var data = JSON.parse(JsonStrip.stripJsonOfComments(request.responseText));
            _.remoteVersion = data.interface;
            
            if (nextFucntionIfSuccessfull != null) nextFucntionIfSuccessfull();
        }, function(request){
            Alerter.createAlert({status: "error", text: `Got response ${request.status} from server.`});
        });
    }

    doUpdate(){
        const _ = this;
        this.getCurrentVersion(function() {
            _.updateInterface();

            _.getRemoteVersion(function(){
                // Check versions
                if (window.compareVersions(_.currentVersion, _.remoteVersion) < 0){
                    Alerter.createAlert({
                        title: "Update available",
                        text: `An update is available (${_.currentVersion} -> ${_.remoteVersion}). Please download it <a style='color: #000;' href='https://github.com/TGRHavoc/live_map-interface'>HERE.</a>`
                    });
                }else{
                    //console.log("Up to date or, a higher version");
                    Alerter.createAlert({
                        status: "success",
                        title: "Version up to date",
                        text: `Have fun with ${_.currentVersion} of LiveMap!`,
                        autoclose: true,
                        autotimeout: 2000
                    });
                }
            });
        });
    }
}

/*
        $jsArrayString = sprintf("An update is available (%s -> %s). Please download it <a style=\'color: #000;\' href=\'%s\'>HERE.</a>", self::$version, self::$latestVer, self::$downloadUrl);

        return "<script> createAlert({ title: 'Update available', message: '" . $jsArrayString . "'}, {type: 'danger', delay: 0}); </script>";
*/
