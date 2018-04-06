// ************************************************************************** //
//            LiveMap Interface - The web interface for the livemap
//                    Copyright (C) 2017  Jordan Dalton
//
//      This program is free software: you can redistribute it and/or modify
//      it under the terms of the GNU General Public License as published by
//      the Free Software Foundation, either version 3 of the License, or
//      (at your option) any later version.
//
//      This program is distributed in the hope that it will be useful,
//      but WITHOUT ANY WARRANTY; without even the implied warranty of
//      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//      GNU General Public License for more details.
//
//      You should have received a copy of the GNU General Public License
//      along with this program in the file "LICENSE".  If not, see <http://www.gnu.org/licenses/>.
// ************************************************************************** //

/*
    Creates an alert and displays it the user

    type = Alert type, "info", "warning", "success", etc (see bootstrap alerts)
    title = Message to show in <strong> tags
    message = A string to show or, an array for multi-lined alert
*/
function createAlert_DEPRECATED(type, title, message, fadeOut){
    if(type == undefined || type == null){
        type = "info";
    }
    if(fadeOut == undefined || fadeOut == null){
        fadeOut = false;
    }

    if(title == undefined || title == null){
        title = "Debug Alert";
    }

    if(message == undefined || message == null){
        console.log("Please provide a message to the createAlert function. kthx.");
        return;
    }

    var msg = "";
    var multiLine = false;
    if(typeof(message) == "object"){
        multiLine = true;
        var length = message.length;

        for(var i = 0; i < length; i++){
            var msgHtml = "<p" + (i == length -1 ? " class=\"mb-0\"" : "") + ">";
            msgHtml += message[i];
            msgHtml += "</p>\n";

            msg += msgHtml;
        }

    }else if(typeof(message) == "string"){
        msg = message
    }else{
        console.log("Message must be an array or string, not a \"%s\"", typeof(message));
        return;
    }

    // Create the alert
    // Set the type
    var id = makeid(5);
    var html = "<div id=\""+id+"\" class=\"alert alert-"+type+" alert-dismissible fade show\" role=\"alert\">";

    //Add the button
    html += "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>";

    if(multiLine){
        html += "<h4 class=\"alert-heading\">"+ title + "</h4>\n" + msg;
    }else{
        html += "<strong>" + title + "</strong>\n" + msg;
    }

    // End the div
    html += "</div>";

    $("#alert-holder").append(html);

    if(fadeOut != false){
        // Auto-close the alert after 10 seconds
        $("#"+ id).slideDown("slow").delay(fadeOut * 1000).fadeOut(1000, function(){
            $(this).remove();
        });
    }
}

function createAlert(data, settings){
    if(data == undefined || data == null){
        console.error("Data needs to be set");
        return;
    }

    if(typeof(data) == "string"){
        var str = data;
        data = {
            message: str
        };
    }

    if(typeof(data.icon) == "undefined"){
        data.icon = "fas fa-exclamation-triangle";
    }

    if(typeof(data.title) == "undefined"){
        data.title = "<strong>Warning!</strong>";
    }

    if(settings == undefined || settings == null || typeof(settings) != "object"){
        settings = {
            newsest_on_top: true,
            placement: {
                from: "bottom",
                align: "left"
            },
            delay: 10000,
            type: "warning"
        };
    }

    // Defaults if they're not set
    if(typeof(settings.placement) == "undefined"){
        settings.placement = { from: "bottom", align: "left"};
    }
    if(typeof(settings.newsest_on_top) == "undefined"){
        settings.newsest_on_top = true;
    }
    if(typeof(settings.delay) == "undefined"){
        settings.delay = 5000;
    }
    if(typeof(settings.type) == "undefined"){
        settings.type = "warning";
    }

    //console.log(JSON.stringify(data));
    //console.log(JSON.stringify(settings));
    
    return $.notify(data, settings);; // Incase I need this in future for shit like prgress bars or, if i need to update the alert
}
