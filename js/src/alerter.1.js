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

    settings = Object.assign({ newsest_on_top: true, placement: { from: "bottom", align: "left" }, delay: 10000, type: "warning" }, settings);

    //console._log(JSON.stringify(data));
    //console._log(JSON.stringify(settings));

    return $.notify(data, settings);; // Incase I need this in future for shit like prgress bars or, if i need to update the alert
}
