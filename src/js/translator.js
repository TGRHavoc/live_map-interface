import { Alerter } from "./alerter";
import { vsprintf } from "sprintf-js";

let _lang = "en";
let _translations = {};
let manifest = {};

const _elements = document.querySelectorAll("[data-i18n]");

export const init = async () => {
    _lang = getLanguage();

    try {
        const resp = await fetch("translations/manifest.json");
        const j = await resp.json();

        manifest = j;

        putLanguagesIntoNavbar(j);

        if (!manifest[_lang]) {
            // The user's language isn't in the manifest... Just fall back to English
            _lang = "en";
        }

        //Translator.setLanguage(Translator._lang);
        localStorage.setItem("lang", _lang);
        toggleLangTag();
    } catch (err) {
        new Alerter({
            status: "error",
            title: "Error getting translation manifest",
            text: err.message,
        });
    }
};

export const translatePage = () => {
    _elements.forEach((element) => {
        replace(element);
    });
};

export const getLanguage = () => {
    let inStorage = localStorage.getItem("lang");

    if (inStorage) {
        return inStorage;
    } else {
        var lang = navigator.languages
            ? navigator.languages[0]
            : navigator.language;

        return lang.substr(0, 2);
    }
};

export const putLanguagesIntoNavbar = (json) => {
    let languageList = document.getElementById("availableLanguages");

    languageList.innerHTML = ""; // Clear any children already here

    for (let key in json) {
        const li = document.createElement("li");
        li.classList.add("dropdown-item");
        li.innerText = `${key} - ${json[key]}`;
        li.setAttribute("data-translation-language", key);

        li.onclick = function () {
            setLanguage(this.getAttribute("data-translation-language"));
        };

        languageList.appendChild(li);
    }
};

export const setLanguage = (lang) => {
    console.log("Switching language to " + lang);

    if (lang === _lang) {
        return;
    }

    _lang = lang;
    localStorage.setItem("lang", _lang);
    toggleLangTag();

    getLanguageFromFile();
};

export const toggleLangTag = () => {
    if (document.documentElement.lang !== _lang) {
        document.documentElement.lang = _lang;
    }

    document.getElementById("currentLang").innerText = _lang;
};

export const getLanguageFromFile = async () => {
    try {
        let translations = await fetch(`translations/${_lang}.json`);
        _translations = await translations.json();
        translatePage();

        return Promise.resolve();
    } catch (ex) {
        new Alerter({
            status: "error",
            title: "Error getting translation file",
            text: ex,
        });

        return Promise.reject(ex);
    }
};

export const getValueFromJSON = (key) => {
    return key
        .split(".")
        .reduce((obj, i) => (obj ? obj[i] : null), _translations);
};

export const t = (key, ...params) => {
    console.log(`Translating ${getValueFromJSON(key)}:`, params);
    return vsprintf(getValueFromJSON(key), params);
};

/**
 *
 * @param {Element} element
 */
export const replace = (element) => {
    if (!element.getAttribute("data-i18n")) {
        console.error(`Element needs a data-i18n attribute to be translated.
                ${element}`);
        return;
    }

    const keys = element.getAttribute("data-i18n").split(/\s/g);
    let attributes = element.getAttribute("data-i18n-attr");

    if (attributes && keys.length !== attributes.split(/\s/g).length) {
        console.warn(
            "The attributes 'data-i18n' and 'data-i18n-attr' must contain the same number of keys."
        );
        console.warn(
            `Values in \`data-i18n\`:
                (${keys.length}) \`${keys.join(" ")}\``
        );
        console.warn(
            `const Values in \`data-i18n-attr\` =
                (${attributes.length}) \`${attributes.join(" ")}\``
        );
        console.warn(`The HTML element is:
            ${element.outerHTML}`);
    }

    if (attributes) {
        attributes = attributes.split(/\s/g);
    }

    keys.forEach((key, index) => {
        const text = getValueFromJSON(key);
        const attr = attributes ? attributes[index] : "innerText";

        if (text) {
            if (attr === "innerHTML" || attr === "innerText") {
                element[attr] = text;
            } else {
                element.setAttribute(attr, text);
            }
        } else {
            console.warn(
                `No translation found for key "${key}" in language "${_lang}". Is there a key/value in your translation file?`
            );
        }
    });
};

export default t;
