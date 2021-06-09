/**
 * Option object for creating alerts
 * @typedef {Object} AlerterOptions
 * @property {string} status=warning            - The status of the alert. One of "warning", "success", "error"
 * @property {string} title=Warning!            - The title of the alert
 * @property {string} text                      - The text of the alert
 * @property {string | null} effect=null        - The effect for the alert. Can be "fade" or "slide"
 * @property {number} speed=500                 - The speed of the effect
 * @property {string | null} customClass=null   - A custom class to add to the alert.
 * @property {string | null} customIcon=null    - HTML For the icon that shows with the alert. Mostly, this is a SVG icon
 * @property {boolean} showIcon=true            - Should the alert show the icon
 * @property {boolean} showCloseButton=true     - Should the alert show the close button
 * @property {boolean} autoclose=true           - Should the alert close itself after an amount of time?
 * @property {number} autotimeout=20000         - How long after the alert has been shown should it automatically close itself (only if autoclose is true)
 * @property {number} gap=10                    - The margin between notifications
 * @property {number} distance=20               - The distance to edges
 * @property {number} type=2                    - The type of the alert
 * @property {string} position=bottom-right     - The position of the alert. Combine x and y position. 'left', 'right', 'top', 'bottom', 'x-center', 'y-center' or use only 'center' to center both x and y.
 */

/**
 * The main class for Alerts.
 */
class Alerter {

    /**
     * @param {AlerterOptions | string} data The options to use to create Alerts or the text of an alert.
     * @constructor
     */
    constructor(data){

        this.DEFAULT_OPTIONS = {
            status: "warning",
            title: 'Warning!',
            text: 'This is a warning',
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

        this.options = Object.assign(this.DEFAULT_OPTIONS, myOptionTemp);

        this.notify = new Notify(this.options);
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

export {Alerter};
