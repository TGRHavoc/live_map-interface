//import fetchMock from "jest-fetch-mock/types";
/// <reference path="../../node_modules/jest-fetch-mock/types/index.d.ts" />

import { Config } from "../src/config";
import { chance } from "./utils/Chance";

const TEST_CONFIG = (
    comments = false,
    debug = true, tileDirectory = true, iconDirectory = true,
    showIdentifiers = true, groupPlayers = true, defaults = true
) => {
    return `{
        ${debug ? `"debug": ${chance.bool()}, ${comments ? "// This is a test comment" : ""}` : ""}
        ${tileDirectory ? `"tileDirectory": "images/tiles",` : ""}
        ${iconDirectory ? `"iconDirectory": "images/icons",` : ""}
        ${showIdentifiers ? `"showIdentifiers": ${chance.bool()},` : ""}
        ${groupPlayers ? `"groupPlayers": ${chance.bool()},` : ""}
        ${defaults ? `"defaults": {
            "ip": "${chance.ip()}",
            "socketPort": "${chance.integer({ min: 1000, max: 4000 })}"
        },` : ""}
        "servers": []
    }`
};

const DEFAULT_CONFIG = {
    debug: false,
    tileDirectory: "images/tiles",
    iconDirectory: "images/icons",
    showIdentifiers: false,
    groupPlayers: true,
    defaults: {
        ip: "127.0.0.1",
        socketPort: "30121"
    },
    servers: []
};

afterAll(() => {
});

beforeAll(() => {
    window.Translator = { t: jest.fn() };
});

beforeEach(() => {
    fetchMock.resetMocks();
    Config.staticConfig = {};
});

describe("getConfigFileFromRemote function", () => {
    fetchMock.mockResponse(TEST_CONFIG(), { status: 200 });

    it("should error if cannot fetch", () => {

        fetchMock.mockResponseOnce("Not found", { status: 404 });

        expect(Config.getConfigFileFromRemote())
            .rejects // We _want_ it to fail..
            .toThrowError("Not Found");

        expect.assertions(1);
    });

    it("should work with comments inside the json", async () => {
        const resp = TEST_CONFIG(true);
        fetchMock.mockResponseOnce(resp, { status: 200 });
        const whatWeSent = JSON.parse(resp.replace("// This is a test comment", ""));

        let conf
        try {
            conf = await Config.getConfigFileFromRemote();
        } catch (e) {
            expect(e).toBeUndefined();
        }

        expect(conf).toBeTruthy();

        Object.keys(whatWeSent).forEach(key => {
            if (key === "servers") return;
            expect(conf[key]).toStrictEqual(whatWeSent[key])
        });
    });


    it("should work set properties", async () => {
        const resp = TEST_CONFIG();
        fetchMock.mockResponseOnce(resp, { status: 200 });
        const whatWeSent = JSON.parse(resp);

        let conf

        try {
            conf = await Config.getConfigFileFromRemote();
        } catch (e) {
            expect(e).toBeUndefined();
        }

        expect(conf).toBeTruthy();

        Object.keys(whatWeSent).forEach(key => {
            if (key === "servers") return;
            expect(conf[key]).toStrictEqual(whatWeSent[key])
        });
    });

    it("should use defaults if something is not set", async () => {
        const chanceSet = {
            debug: chance.bool(),
            tileDirectory: chance.bool(),
            iconDirectory: chance.bool(),
            showIdentifiers: chance.bool(),
            groupPlayers: chance.bool(),
            defaults: chance.bool()
        };

        const ourConfig = TEST_CONFIG(false, ...Object.values(chanceSet));
        fetchMock.mockResponseOnce(ourConfig, { status: 200 });
        const whatWeSent = JSON.parse(ourConfig);

        let conf;
        try {
            conf = await Config.getConfigFileFromRemote();
        } catch (e) {
            expect(e).toBeUndefined()
        }


        expect(conf).toBeTruthy();

        Object.keys(chanceSet).forEach(key => {
            if (chanceSet[key]) { // It should have been set
                expect(conf[key]).toStrictEqual(whatWeSent[key]);
            } else {// It should be default
                expect(conf[key]).toStrictEqual(DEFAULT_CONFIG[key]);
            }
        });

    });

});

describe("getConfig", () => {
    it("should call out and get config", async () => {

        const resp = TEST_CONFIG();
        fetchMock.mockResponseOnce(resp, { status: 200 });
        const whatWeSent = JSON.parse(resp);

        try {

            let conf = await Config.getConfig();

            expect(JSON.stringify(conf)).toBe("{}");
            expect(console.warn).toBeCalledTimes(1);
            expect(console.warn).toBeCalledWith("config didn't exist... try getting it again");

            setTimeout(async () => {
                const conf = await Config.getConfig();

                Object.keys(whatWeSent).forEach(key => {
                    if (key === "servers") return;
                    expect(conf[key]).toStrictEqual(whatWeSent[key])
                });
            }, 500); // Emulate a network request.

        } catch (e) {
            expect(e).toBeUndefined();
        }
    });
});
