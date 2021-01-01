import * as fs from "fs";
import { CompanionResponse, Location } from "../common/types";
import { ActivityName } from './activities';
import { listenSettings } from "./messaging";

const SETTINGS_FILE = "settings.cbor";

export interface Settings {
    useGps: boolean,
    location?: Location;
    activities: ActivityName[];
    background: string;
    zenith: number;
    showRHR: boolean;
}

const defaultSettings: Settings = {
    useGps: false,
    activities: ["heart-rate", "steps", "floors"],
    background: "milky-way-bg.png",
    zenith: 90.833,
    showRHR: false,
}

let settings = undefined;

if (fs.existsSync(SETTINGS_FILE)) {
    let readSettings = fs.readFileSync(SETTINGS_FILE, "cbor");
    console.log("Read local settings: " + JSON.stringify(settings));
    settings = {...defaultSettings, readSettings};
} else {
    console.log("Creating default settings");
    settings = {...defaultSettings};
    fs.writeFileSync(SETTINGS_FILE, settings, "cbor");
}

listenSettings((err, setting: CompanionResponse) => {
    console.log("Got the setting: " + JSON.stringify(setting));
    if (setting?.data) {
        if (setting.data.activity1) {
            const activity = setting.data.activity1.values?.[0]?.value;
            if (activity) {
                settings.activities[0] = activity;
            }
        } else if (setting.data.activity2) {
            const activity = setting.data.activity2.values?.[0]?.value;
            if (activity) {
                settings.activities[1] = activity;
            }
        } else if (setting.data.activity3) {
            const activity = setting.data.activity3.values?.[0]?.value;
            if (activity) {
                settings.activities[2] = activity;
            }
        } else if (setting.data.background) {
            const background = setting.data.background.values?.[0]?.value;
            if (background) {
                settings.background = background;
            }
        } else if (setting.data.zenith) {
            const zenith = setting.data.zenith.values?.[0]?.value;
            if (zenith) {
                settings.zenith = parseInt(zenith);
            }
        } else {
            settings = {...settings, ...setting.data};
        }
        fs.writeFileSync(SETTINGS_FILE, settings, "cbor");
    }
});

export function getSettings(): Settings {
    return settings;
}

export function getSetting(name: string): any | undefined {
    return settings[name];
}
