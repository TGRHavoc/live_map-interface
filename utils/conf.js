$.fn.serializeObject = function () {
    var self = this,
        json = {},
        push_counters = {},
        patterns = {
            "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
            "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
            "push": /^$/,
            "fixed": /^\d+$/,
            "named": /^[a-zA-Z0-9_]+$/
        };
    this.build = function (base, key, value) {
        if (value == "true" || value == "false") value = (value == "true");
        base[key] = value;
        return base;
    };

    this.push_counter = function (key) {
        if (push_counters[key] === undefined) {
            push_counters[key] = 0;
        }
        return push_counters[key]++;
    };

    $.each($(this).serializeArray(), function () {

        // skip invalid keys
        if (!patterns.validate.test(this.name)) {
            return;
        }

        var k,
            keys = this.name.match(patterns.key),
            merge = this.value,
            reverse_key = this.name;

        while ((k = keys.pop()) !== undefined) {

            // adjust reverse_key
            reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

            // push
            if (k.match(patterns.push)) {
                merge = self.build([], self.push_counter(reverse_key), merge);
            }

            // fixed
            else if (k.match(patterns.fixed)) {
                merge = self.build([], k, merge);
            }

            // named
            else if (k.match(patterns.named)) {
                merge = self.build({}, k, merge);
            }
        }

        json = $.extend(true, json, merge);
    });

    return json;
};

function clean(obj){
    for (var propName in obj) {

        if (typeof(obj[propName]) === "object"){
            clean(obj[propName]);
            if (Object.keys(obj[propName]).length == 0){
                obj[propName] = null;
            }
        }

        if (obj[propName] === "" || obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
}

window.serversToAdd = {};
window.editingServer = false;

$("#generateConfigBtn").click(function (e) {
    e.preventDefault();

    $("#mainFormThatContainsDefaults").validate();

    if ($("#mainFormThatContainsDefaults").valid()) {
        var configObject = $("#mainFormThatContainsDefaults").serializeObject();
        console.log(configObject);
        configObject["servers"] = window.serversToAdd;

        $("#outputArea").val(JSON.stringify(configObject, null, 4));
    } else {
        createAlert({
            title: "<strong>Couldn't generate config!</strong>",
            message: "Please make sure the fields have valid values"
        });
    }

});
$("#addServerButton").click(function (e) {
    e.preventDefault();
    $("#secondaryServerConfigForm").trigger("reset"); //Reset the form
    $("#serverConfigBitThatFades").fadeIn("slow"); // Fade it in
});

$("#deleteServerButton").click(function (e) {
    e.preventDefault();
    if (Object.keys(window.serversToAdd).length == 0) {
        createAlert("Cannot delete server as you haven't added any yet.");
        return;
    }

    var selectedIndex = $("#serverSelect").children("option:selected").val();
    var elem = $("#serverSelect option[value='" + selectedIndex + "']");
    console.log(elem);
    elem.remove();

    delete window.serversToAdd[selectedIndex.replace("_", " ")];
});

$("#editServerButton").click(function (e) {
    e.preventDefault();

    if (Object.keys(window.serversToAdd).length == 0) {
        createAlert("Cannot edit server as you haven't added any yet.");
        return;
    }

    var selectedIndex = $("#serverSelect").children("option:selected").val();
    var obj = window.serversToAdd[selectedIndex.replace("_", " ")];
    console.log(obj);
    for (const key in obj) {
        console.log(key + " = " + obj[key]);
        $("#" + key).val(obj[key]);
    }
    $("#name").val($("#serverSelect").children("option:selected").text());

    window.editingServer = true;
    window.editingName = $("#serverSelect").children("option:selected").text();
});

$("#serverConfigAdd").click(function (e) {
    e.preventDefault();

    var f = $("#secondaryServerConfigForm");

    f.validate();
    if (!(f.valid())){
        createAlert("Please make sure the server config is valid.");
        return;
    }

    var name = $("#name").val(); // Just to index it in the array and allow selecting for edditing/deleting.

    if (name in window.serversToAdd && !window.editingServer){
        createAlert("Name already used. Please choose a different one.");
        return;
    }

    var server = f.serializeObject();
    clean(server);
    console.log(name);
    window.serversToAdd[name] = server;

    if(window.editingServer && name != window.editingName){
        // We want to remove the old one
        delete window.serversToAdd[window.editingName];
        $("#serverSelect option[value='" + window.editingName.replace(/\s/g, "_") + "']").remove();
    }

    $("#serverSelect").append(`<option id="serverName_${name.replace(/\s/g, '_')}" value="${name.replace(/\s/g, '_')}">${name}</option>`);
    if(window.editingServer){
        window.editingServer = false;
    }

    $("#secondaryServerConfigForm").trigger("reset");
});
$("#serverConfigReset").click(function (e) {
    e.preventDefault();
    $("#secondaryServerConfigForm").trigger("reset");
});
