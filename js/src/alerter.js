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

function makeid(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < len; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

/*
    Creates an alert and displays it the user

    type = Alert type, "info", "warning", "success", etc (see bootstrap alerts)
    title = Message to show in <strong> tags
    message = A string to show or, an array for multi-lined alert
*/
function createAlert(type, title, message, fadeOut){
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
    var html = "<div id=\""+id+"\" class=\"alert alert-"+type+" alert-dismissible fade in\" role=\"alert\">";

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

    if(fadeOut){
        // Auto-close the alert after 10 seconds
        $("#"+ id).slideDown("slow").delay(10000).fadeOut(1000, function(){
            $(this).remove();
        });
    }
}
