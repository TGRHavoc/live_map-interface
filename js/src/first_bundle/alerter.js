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
