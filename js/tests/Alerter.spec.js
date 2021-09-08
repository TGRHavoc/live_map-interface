import { Alerter } from "../src/alerter";
import { chance, getChance } from "./utils/Chance";
import { DOCUMENT_BODY } from "./utils/jsdomSetup";
import "./utils/IntersectObs";

const CreateAlert = (data) => {
    return () => new Alerter(data); // Needs to return a function for Jest to call
}

test("error thrown when no message passed", () => {
    const NoMessageError = "Please pass some data. It should be a string (message) or an Alert Object (see docs)";
    expect(CreateAlert()).toThrowError(NoMessageError);
});

test("text should be set", () => {
    const str = chance.string();
    const A = new Alerter(str);
    expect(A.options.text).toBe(str);
});

const STATUSES = ["warning", "success", "error"];
const EFFECTS = ["fade", "slide"];
const POSITION_X = ["left", "right", "x-center"];
const POSITION_Y = ["top", "bottom", "center", "y-center"];

describe("properties are set", () => {
    // for (let i = 0; i <= 5; i++) {
    let props = {
        status: chance.pickone(STATUSES),
        title: chance.word(),
        text: chance.sentence(),
        effect: chance.pickone(EFFECTS),
        speed: chance.integer({ min: 10, max: 2000 }),
        customClass: null,
        customIcon: null,
        showIcon: chance.bool(),
        showCloseButton: chance.bool(),
        autoclose: chance.bool(),
        autotimeout: chance.integer({ min: 1000, max: 50000 }),
        gap: 10,
        distance: 20,
        type: chance.integer({ min: 1, max: 3 }),
        position: `${chance.pickone(POSITION_Y)} ${chance.pickone(POSITION_X)}`,
    };

    const Alert = new Alerter(props);

    Object.keys(props).forEach(key => {
        test(`${key}`, () => {
            expect(Alert.options[key]).toBe(props[key]);
        });
    });
    // }
});

function findChildElementWithClassName(parent, className) {
    let foundChild = false;
    let ourElement = undefined;

    for (let i = 0; i < parent.children.length; i++) {
        let ourChild = parent.children[i];
        if (ourChild.className == className) {
            foundChild = true;
            ourElement = ourChild;
        }
    }

    return [foundChild, ourElement];
}

describe("alerts added to dom", () => {

    document.body.innerHTML = DOCUMENT_BODY;

    let props = {
        status: chance.pickone(STATUSES),
        title: chance.word(),
        text: chance.sentence(),
        effect: chance.pickone(EFFECTS),
        speed: chance.integer({ min: 10, max: 2000 }),
        customClass: null,
        customIcon: null,
        showIcon: chance.bool(),
        showCloseButton: chance.bool(),
        autoclose: false,
        gap: 10,
        distance: 20,
        type: chance.integer({ min: 1, max: 3 }),
        position: `${chance.pickone(POSITION_Y)} ${chance.pickone(POSITION_X)}`,
    };

    new Alerter(props);

    const notifContainer = document.querySelector(".notifications-container");

    it("should create a notif container and add the notification", () => {
        expect(notifContainer).toBeTruthy(); // It's been added... Check its content?
        expect(notifContainer.childElementCount).toBeGreaterThan(0);
        expect(notifContainer.childElementCount).toBe(1);
    });

    describe("notification", () => {
        const childEle = notifContainer.children[0];

        it("should have classes", () => {
            expect(childEle).toHaveClass(
                "notify", `notify--type-${props.type}`
            );
        });

        it("should show icon if set", () => {
            let [foundIcon, iconEle] = findChildElementWithClassName(childEle, "notify__icon");

            expect(foundIcon).toBe(props.showIcon);
            if (props.showIcon) {
                expect(iconEle).toBeTruthy();
            } else {
                expect(iconEle).toBeUndefined();
            }
        });
        it("should show close icon if set", () => {
            let [foundIcon, iconEle] = findChildElementWithClassName(childEle, "notify__close");

            expect(foundIcon).toBe(props.showCloseButton);
            if (props.showCloseButton) {
                expect(iconEle).toBeTruthy();
            } else {
                expect(iconEle).toBeUndefined();
            }
        });

        describe("should have content", () => {

            let [foundEle, ele] = findChildElementWithClassName(childEle, "notify-content");

            expect(foundEle).toBe(true);
            expect(ele).toBeTruthy();
            expect(ele.childElementCount).toBe(2);

            it("should have a title", () => {
                let [foundTitle, title] = findChildElementWithClassName(ele, "notify__title");
                expect(foundTitle).toBe(true);
                expect(title.textContent).toBe(props.title);
            });

            it("should have a message", () => {
                let [foundTitle, title] = findChildElementWithClassName(ele, "notify__text");
                expect(foundTitle).toBe(true);
                expect(title.textContent).toBe(props.text);
            });
        });
    });
});

