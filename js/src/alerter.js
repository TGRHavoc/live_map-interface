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

export class Alerter {

    constructor(data){
        this.DEFAULT_OPTIONS = {
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

        var myOptions = Object.assign(this.DEFAULT_OPTIONS, myOptionTemp);

        this.notify = new Notify(myOptions);
    }
}

/* For testing the styles
new Alerter({title: "success test", text: "<a href='#'>Link!</a> Some more text!", type: 1, status: "success"});
new Alerter({title: "success test", text: "<a href='#'>Link!</a> Some more text!", type: 2, status: "success"});
new Alerter({title: "success test", text: "<a href='#'>Link!</a> Some more text!", type: 3, status: "success"});
new Alerter({title: "warning test", text: "<a href='#'>Link!</a> Some more text!", type: 1, status: "warning"});
new Alerter({title: "warning test", text: "<a href='#'>Link!</a> Some more text!", type: 2, status: "warning"});
new Alerter({title: "warning test", text: "<a href='#'>Link!</a> Some more text!", type: 3, status: "warning"});
new Alerter({title: "error test", text: "<a href='#'>Link!</a> Some more text!", type: 1, status: "error"});
new Alerter({title: "error test", text: "<a href='#'>Link!</a> Some more text!", type: 2, status: "error"});
new Alerter({title: "error test", text: "<a href='#'>Link!</a> Some more text!", type: 3, status: "error"});
*/
