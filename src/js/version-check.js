import { Alerter } from "./alerter";
import { t } from "./translator";

const versionFile = "version.json";
const remoteVersionUrl =
    "https://raw.githubusercontent.com/TGRHavoc/live_map-interface/master/version.json";
const semver =
    /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+))?(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;

let currentVersion = "0.0.0";
let remoteVersion = "4.0.0";

const updateInterface = () =>
    (document.getElementById("livemapVersion").textContent = currentVersion);

const indexOrEnd = (str, q) =>
    str.indexOf(q) === -1 ? str.length : str.indexOf(q);

const split = (v) => {
    var c = v.replace(/^v/, "").replace(/\+.*$/, "");
    var patchIndex = indexOrEnd(c, "-");
    var arr = c.substring(0, patchIndex).split(".");
    arr.push(c.substring(patchIndex + 1));
    return arr;
};

const tryParse = (v) => {
    return isNaN(Number(v)) ? v : Number(v);
};

const validate = (version) => {
    if (typeof version !== "string") {
        throw new TypeError("Invalid argument expected string");
    }
    if (!semver.test(version)) {
        throw new Error(
            "Invalid argument not valid semver ('" + version + "' received)"
        );
    }
};

const compareVersions = (v1, v2) => {
    [v1, v2].forEach((e) => validate(e));

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
        var p1 = sp1.split(".").map(tryParse);
        var p2 = sp2.split(".").map(tryParse);

        for (i = 0; i < Math.max(p1.length, p2.length); i++) {
            if (
                p1[i] === undefined ||
                (typeof p2[i] === "string" && typeof p1[i] === "number")
            )
                return -1;
            if (
                p2[i] === undefined ||
                (typeof p1[i] === "string" && typeof p2[i] === "number")
            )
                return 1;

            if (p1[i] > p2[i]) return 1;
            if (p2[i] > p1[i]) return -1;
        }
    } else if (sp1 || sp2) {
        return sp1 ? -1 : 1;
    }

    return 0;
};

const getCurrentVersion = async () => {
    try {
        let response = await fetch(versionFile);

        let data = await response.json();
        currentVersion = data.interface;

        return Promise.resolve(data.interface);
    } catch (error) {
        new Alerter({
            status: "error",
            text: t("errors.version-check.current.message", {
                error: error,
            }),
            title: t("errors.version-check.current.title"),
        });

        return Promise.reject(error);
    }
};

const getRemoteVersion = async () => {
    try {
        let response = await fetch(remoteVersionUrl);
        let data = await response.json();

        remoteVersion = data.interface;
        return Promise.resolve(data.interface);
    } catch (err) {
        new Alerter({
            status: "error",
            text: t("errors.version-check.remote.message", {
                error: err,
            }),
            title: t("errors.version-check.remote.title"),
        });

        return Promise.reject(err);
    }
};

export const doUpdateChecks = async () => {
    try {
        await getCurrentVersion();
        updateInterface();

        await getRemoteVersion();
    } catch (err) {
        console.error(err);
    }

    if (compareVersions(currentVersion, remoteVersion) <= 0) {
        new Alerter({
            title: t("updates.available.title"),
            text: t("updates.available.message", {
                currentVersion,
                remoteVersion,
            }),
        });
    } else {
        //console.log("Up to date or, a higher version");
        new Alerter({
            status: "success",
            title: t("updates.latest.title"),
            text: t("updates.latest.message", {
                currentVersion,
                remoteVersion,
            }),
            autoclose: true,
            autotimeout: 10000,
        });
    }
};

// window.VersionCheck = new VersionCheck();

/*
        $jsArrayString = sprintf("An update is available (%s -> %s). Please download it <a style=\'color: #000;\' href=\'%s\'>HERE.</a>", self::$version, self::$latestVer, self::$downloadUrl);

        return "<script> createAlert({ title: 'Update available', message: '" . $jsArrayString . "'}, {type: 'danger', delay: 0}); </script>";
*/
