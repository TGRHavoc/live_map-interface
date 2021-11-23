import { Alerter } from "./alerter";
import { vsprintf } from "./sprintf";

const Translator = {

    _lang ="en",
    translations: {},
    manifest: {},
    _elements: document.querySelectorAll("[data-i18n]"),


    init: () => {
        Translator._lang = Translator.getLanguage();

        fetch("translations/manifest.json").then(async resp => {
            let j = await resp.json();
            Translator.manifest = j;

            Translator.putLanguagesIntoNavbar(j);

            if (!Translator.manifest[Translator._lang]) { // The user's language isn't in the manifest... Just fall back to English
                Translator._lang = "en";
            }

            //Translator.setLanguage(Translator._lang);
            localStorage.setItem("lang", Translator._lang);
            Translator.toggleLangTag();

        }).catch(err => {
            new Alerter({
                status: "error",
                title: "Error getting translation manifest",
                text: err.message
            });
        });
    },

    translatePage: ()=> {
        Translator._elements.forEach((element) => {
            Translator.replace(element);
        });
    },

    getLanguage: () => {
        let inStorage = localStorage.getItem("lang");

        if (inStorage) {
            return inStorage;
        } else {
            var lang = navigator.languages ? navigator.languages[0] : navigator.language;

            return lang.substr(0, 2);
        }
    },

    putLanguagesIntoNavbar(json) {
        let languageList = document.getElementById("availableLanguages");

        languageList.innerHTML = ""; // Clear any children already here

        for (let key in json) {
            const li = document.createElement("li");
            li.classList.add("dropdown-item");
            li.innerText = `${key} - ${json[key]}`;
            li.setAttribute("data-translation-language", key);

            li.onclick = function () {
                window.Translator.setLanguage(Translator.getAttribute("data-translation-language"));
            };

            languageList.appendChild(li);
        }
    },

    setLanguage: (lang) => {
        console.log("Switching language to " + lang);

        if (lang == Translator._lang) {
            return;
        }

        Translator._lang = lang;
        localStorage.setItem("lang", Translator._lang);
        Translator.toggleLangTag();

        Translator.getLanguageFromFile();
    },

    toggleLangTag: () => {
        if (document.documentElement.lang !== Translator._lang) {
            document.documentElement.lang = Translator._lang;
        }

        document.getElementById("currentLang").innerText = Translator._lang;
    },

    getLanguageFromFile: async ()=> {
        try {
            let translations = await fetch(`translations/${Translator._lang}.json`);
            Translator.translations = await translations.json();
            Translator.translatePage();

            return Promise.resolve();
        } catch (ex) {
            new Alerter({
                status: "error",
                title: "Error getting translation file",
                text: ex
            });

            return Promise.reject(ex);
        }
    },

    getValueFromJSON(key) {
        return key.split(".").reduce((obj, i) => (obj ? obj[i] : null), Translator.translations);
    },

    t(key, ...params) {
        console.log(`Translating ${Translator.getValueFromJSON(key)}:`, params);
        return vsprintf(Translator.getValueFromJSON(key), params);
    },

    /**
     *
     * @param {Element} element
     */
     replace: (element) => {
        if (!element.getAttribute("data-i18n")) {
            console.error(`Element needs a data-i18n attribute to be translated.
                ${element}`);
            return;
        }

        const keys = element.getAttribute("data-i18n").split(/\s/g);
        let attributes = element.getAttribute("data-i18n-attr");

        if (attributes && keys.length != attributes.split(/\s/g).length) {
            console.warn(`The attributes "data-i18n" and "data-i18n-attr" must contain the same number of keys.
Values in \`data-i18n\`:      (${keys.length}) \`${keys.join(" ")}\`
Values in \`data-i18n-attr\`: (${attributes.length}) \`${attributes.join(" ")}\`
The HTML element is:
    ${element.outerHTML}`);
        }

        if (attributes) {
            attributes = attributes.split(/\s/g);
        }

        keys.forEach((key, index) => {
            const text = Translator.getValueFromJSON(key);
            const attr = attributes ? attributes[index] : "innerText";

            if (text) {
                if (attr == "innerHTML" || attr == "innerText") {
                    element[attr] = text;
                } else {
                    element.setAttribute(attr, text);
                }
            } else {
                console.warn(`No translation found for key "${key}" in language "${Translator._lang}". Is there a key/value in your translation file?`);
            }
        });
    },
}

export { Translator };
