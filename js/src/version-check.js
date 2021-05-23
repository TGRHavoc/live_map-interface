import {Alerter} from "./alerter.js";

export class VersionCheck {

    constructor(){
        this.versionFile = "version.json";
        this.currentVersion = "0.0.0";
        this.remoteVersion = "4.0.0";
        this.remoteVersionUrl = "https://raw.githubusercontent.com/TGRHavoc/live_map-interface/master/version.json";

        this.semver = /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;

        this.doUpdate();
    }

    updateInterface(){
        document.getElementById("livemap_version").textContent = this.currentVersion;
    }

    indexOrEnd(str, q) {
        return str.indexOf(q) === -1 ? str.length : str.indexOf(q);
    }

    split(v) {
        var c = v.replace(/^v/, '').replace(/\+.*$/, '');
        var patchIndex = this.indexOrEnd(c, '-');
        var arr = c.substring(0, patchIndex).split('.');
        arr.push(c.substring(patchIndex + 1));
        return arr;
    }

    tryParse(v) {
        return isNaN(Number(v)) ? v : Number(v);
    }

    validate(version) {
        if (typeof version !== 'string') {
            throw new TypeError('Invalid argument expected string');
        }
        if (!this.semver.test(version)) {
            throw new Error('Invalid argument not valid semver (\'' + version + '\' received)');
        }
    }

    compareVersions(v1, v2) {
        [v1, v2].forEach(validate);

        var s1 = split(v1);
        var s2 = split(v2);

        for (var i = 0; i < Math.max(s1.length - 1, s2.length - 1); i++) {
            var n1 = parseInt(s1[i] || 0, 10);
            var n2 = parseInt(s2[i] || 0, 10);

            if (n1 > n2) return 1;
            if (n2 > n1) return -1;
        }

        var sp1 = s1[s1.length - 1];
        var sp2 = s2[s2.length - 1];

        if (sp1 && sp2) {
            var p1 = sp1.split('.').map(this.tryParse);
            var p2 = sp2.split('.').map(this.tryParse);

            for (i = 0; i < Math.max(p1.length, p2.length); i++) {
                if (p1[i] === undefined || typeof p2[i] === 'string' && typeof p1[i] === 'number') return -1;
                if (p2[i] === undefined || typeof p1[i] === 'string' && typeof p2[i] === 'number') return 1;

                if (p1[i] > p2[i]) return 1;
                if (p2[i] > p1[i]) return -1;
            }
        } else if (sp1 || sp2) {
            return sp1 ? -1 : 1;
        }

        return 0;
    }

    async getCurrentVersion(){
        try{
            let response = await fetch(this.versionFile);

            let data = await response.json();
            this.currentVersion = data.interface;

            return Promise.resolve(data.interface);

        }catch(error){
            new Alerter({
                status: "error",
                text: err.message,
                title: "Error doing version update"
            });

            return Promise.reject(error);
        }
    }

    async getRemoteVersion(){
        try{
            let response = await fetch(this.remoteVersionUrl);
            let data = await response.json();

            this.remoteVersion = data.interface;
            return Promise.resolve(data.interface);
        }catch(err){
            new Alerter({
                status: "error",
                text: err.message,
                title: "Error doing version update"
            });

            return Promise.reject(err);
        }
    }

    async doUpdate(){
        const _ = this;

        try{
            await this.getCurrentVersion();
            this.updateInterface();

            await this.getRemoteVersion();


            if (window.compareVersions(this.currentVersion, this.remoteVersion) < 0){
                new Alerter({
                    title: "Update available",
                    text: `An update is available (${this.currentVersion} -> ${this.remoteVersion}). Please download it <a style='color: #000;' href='https://github.com/TGRHavoc/live_map-interface'>HERE.</a>`
                });
            }else{
                //console.log("Up to date or, a higher version");
                new Alerter({
                    status: "success",
                    title: "Version up to date",
                    text: `Have fun with ${this.currentVersion} of LiveMap!`,
                    autoclose: true,
                    autotimeout: 2000
                });
            }

        }catch(err){
            console.error(err);
        }

    }
}

// window.VersionCheck = new VersionCheck();

/*
        $jsArrayString = sprintf("An update is available (%s -> %s). Please download it <a style=\'color: #000;\' href=\'%s\'>HERE.</a>", self::$version, self::$latestVer, self::$downloadUrl);

        return "<script> createAlert({ title: 'Update available', message: '" . $jsArrayString . "'}, {type: 'danger', delay: 0}); </script>";
*/
