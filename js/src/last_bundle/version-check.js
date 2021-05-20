class VersionCheck {

    constructor(){
        this.versionFile = "version.json";
        this.currentVersion = "0.0.0";
        this.remoteVersion = "4.0.0";
        this.remoteVersionUrl = "https://raw.githubusercontent.com/TGRHavoc/live_map-interface/master/version.json";

        this.doUpdate();
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

        fetch(this.versionFile).then(async response => {
            if (!response.ok){
                throw Error("Response wasn't OK... " + response.statusText);
            }
            let data = await response.json();
            _.currentVersion = data.interface;

            if (nextFucntionIfSuccessfull != null) nextFucntionIfSuccessfull();

        }).catch(err => {
            Alerter.createAlert({
                status: "error",
                text: err.message,
                title: "Error doing version update"
            });
        });
    }

    getRemoteVersion(nextFucntionIfSuccessfull){
        const _ = this;

        fetch(_.remoteVersionUrl).then(async response => {
            if (!response.ok){
                throw Error("Response wasn't OK... " + response.statusText);
            }
            let data = await response.json();
            _.remoteVersion = data.interface;

            if (nextFucntionIfSuccessfull != null) nextFucntionIfSuccessfull();
        }).catch(err => {
            Alerter.createAlert({
                status: "error",
                text: err.message,
                title: "Error doing version update"
            });
        });

    }

    doUpdate(){
        const _ = this;
        this.getCurrentVersion(() => {
            _.updateInterface();

            _.getRemoteVersion(() => {
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

window.VersionCheck = new VersionCheck();

/*
        $jsArrayString = sprintf("An update is available (%s -> %s). Please download it <a style=\'color: #000;\' href=\'%s\'>HERE.</a>", self::$version, self::$latestVer, self::$downloadUrl);

        return "<script> createAlert({ title: 'Update available', message: '" . $jsArrayString . "'}, {type: 'danger', delay: 0}); </script>";
*/
