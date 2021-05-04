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
/**
AlertOptions {
    status: "warning" | "success" | "error",
    title: string,
    text: string,
    effect: "fade" | "slide" | null,
    speed: number ,
    customClass: string | null,
    customIcon: string | null,
    showIcon: boolean,
    showCloseButton: boolean,
    autoclose: boolean,
    autotimeout: number,
    gap: number,
    distance: number,
    type: 1 | 2 | 3,
    position: string, // e.g. "center left"
}
 */

class Alerter {
    static createAlert(data) {
        if (data == undefined || data == null) {
            console.error("Data needs to be set");
            return;
        }
        var myOptionTemp;
        if (typeof (data) == "string") {
            myOptionTemp = { text: data };
        }
        else {
            myOptionTemp = data;
        }
        var myOptions = Object.assign(Alerter.DEFAULT_OPTIONS, myOptionTemp);
        return new Notify(myOptions);
    }
}

Alerter.DEFAULT_OPTIONS = {
    status: 'warning',
    title: 'Warning!',
    text: 'Notify text lorem ipsum',
    effect: 'fade',
    speed: 500,
    customClass: null,
    customIcon: null,
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: 20000,
    gap: 10,
    distance: 20,
    type: 2,
    position: 'bottom right'
};

/* For testing the styles
Alerter.createAlert({title: "success test", text: "<a href='#'>Link!</a> Some more text!", type: 1, status: "success"});
Alerter.createAlert({title: "success test", text: "<a href='#'>Link!</a> Some more text!", type: 2, status: "success"});
Alerter.createAlert({title: "success test", text: "<a href='#'>Link!</a> Some more text!", type: 3, status: "success"});
Alerter.createAlert({title: "warning test", text: "<a href='#'>Link!</a> Some more text!", type: 1, status: "warning"});
Alerter.createAlert({title: "warning test", text: "<a href='#'>Link!</a> Some more text!", type: 2, status: "warning"});
Alerter.createAlert({title: "warning test", text: "<a href='#'>Link!</a> Some more text!", type: 3, status: "warning"});
Alerter.createAlert({title: "error test", text: "<a href='#'>Link!</a> Some more text!", type: 1, status: "error"});
Alerter.createAlert({title: "error test", text: "<a href='#'>Link!</a> Some more text!", type: 2, status: "error"});
Alerter.createAlert({title: "error test", text: "<a href='#'>Link!</a> Some more text!", type: 3, status: "error"});
*/
