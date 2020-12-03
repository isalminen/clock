import * as fs from "fs";
import { CompanionResponse, Location } from "../common/types";
import { listenSettings } from "./messaging";

const SETTINGS_FILE = "settings.cbor";

export interface Settings {
    useGps: false,
    location?: Location;
}

let settings: Settings = {
    useGps: false,
}

if (fs.existsSync(SETTINGS_FILE)) {
    settings = fs.readFileSync(SETTINGS_FILE, "cbor");
    console.log("Read local settings: " + JSON.stringify(settings));
} else {
    console.log("Creating default settings");
    fs.writeFileSync(SETTINGS_FILE, settings, "cbor");
}

listenSettings((err, setting: CompanionResponse) => {
    console.log("Got the setting: " + JSON.stringify(setting));
    if (setting?.data) {
        settings = {...settings, ...setting.data};
        fs.writeFileSync(SETTINGS_FILE, settings, "cbor");
    }
});

export function getSettings(): Settings {
    return settings;
}

export function getSetting(name: string): any | undefined {
    return settings[name];
}
