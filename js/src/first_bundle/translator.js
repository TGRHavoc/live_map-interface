/// <reference path="./alerter.js" />
/// <reference path="./1_utils.js" />
/// <reference path="./config.js" />

class Translator {

    constructor() {
        this._lang = this.getLanguage();
        this.translations = {};

        this._elements = document.querySelectorAll("[data-i18n]");

        // Get the current manifest
        const _ = this;

        fetch("translations/manifest.json").then(async resp => {
            let j = await resp.json();
            _.putLanguagesIntoNavbar(j);
        }).catch(err => {
            Alerter.createAlert({
                status: "error",
                title: "Error getting translation manifest",
                text: err.message
            });
        });

        //this.setLanguage(this._lang);
        localStorage.setItem("lang", this._lang);
        this.toggleLangTag();

        this.getLanguageFromFile();

    }

    putLanguagesIntoNavbar(json) {
        let languageList = document.getElementById("available-language");

        for (let key in json) {
            const li = document.createElement("li");
            li.classList.add("dropdown-item");
            li.innerText = `${key} - ${json[key]}`;
            li.setAttribute("data-translation-language", key);

            li.onclick = function () {
                window.Translator.setLanguage(this.getAttribute("data-translation-language"))
            }

            languageList.appendChild(li);
        }
    }

    setLanguage(lang) {
        Config.log("Switching language to " + lang);

        if (lang == this._lang) {
            return;
        }

        this._lang = lang;
        localStorage.setItem("lang", this._lang);
        this.toggleLangTag();

        this.getLanguageFromFile();
    }

    toggleLangTag() {
        if (document.documentElement.lang !== this._lang) {
            document.documentElement.lang = this._lang;
        }

        document.getElementById("current_lang").innerText = this._lang;
    }

    getLanguageFromFile() {
        const _ = this;
        fetch(`translations/${this._lang}.json`).then(response => {
            if (!response.ok) {
                Alerter.createAlert({
                    status: "error",
                    title: "Error getting translation file",
                    text: `I received the error code ${response.status}`
                });
                return;
            }

            return response.json();
        }).then(translations => {

            _.translations = translations;
            _.translatePage();
        }).catch(err => {
            console.error(err);
            Alerter.createAlert({
                status: "error",
                title: "Error getting translation file",
                text: err.message
            });
        })
    }

    getValueFromJSON(key) {
        return key.split('.').reduce((obj, i) => (obj ? obj[i] : null), this.translations);
    }

    /**
     * 
     * @param {Element} element 
     */
    replace(element) {
        if (!element.getAttribute("data-i18n")){
            console.error(`Element needs a data-i18n attribute to be translated.
                ${element}`);
            return;
        }

        const keys = element.getAttribute('data-i18n').split(/\s/g);
        let attributes = element.getAttribute('data-i18n-attr');

        if (attributes && keys.length != attributes.split(/\s/g).length) {
            console.warn(`The attributes "data-i18n" and "data-i18n-attr" must contain the same number of keys.
Values in \`data-i18n\`:      (${keys.length}) \`${keys.join(' ')}\`
Values in \`data-i18n-attr\`: (${attributes.length}) \`${attributes.join(' ')}\`
The HTML element is:
    ${element.outerHTML}`);
        }

        if (attributes){
            attributes = attributes.split(/\s/g);
        }

        keys.forEach((key, index) => {
            const text = this.getValueFromJSON(key);
            const attr = attributes ? attributes[index] : "innerText";

            if (text) {
                if (attr == "innerHTML" || attr == "innerText") {
                    element[attr] = text;
                } else {
                    element.setAttribute(attr, text);
                }
            } else {
                console.warn(`No translation found for key "${key}" in language "${this._lang}". Is there a key/value in your translation file?`);
            }
        });
    }

    translatePage() {
        this._elements.forEach((element) => {
            this.replace(element);
        });
    }

    getLanguage() {
        let inStorage = localStorage.getItem("lang");

        if (inStorage) {
            return inStorage;
        } else {
            var lang = navigator.languages ? navigator.languages[0] : navigator.language;

            return lang.substr(0, 2);
        }
    }

}

document.addEventListener('DOMContentLoaded', (event) => {
    window.Translator = new Translator();
})