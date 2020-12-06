import * as fs from "fs";
import { CompanionResponse, Location } from "../common/types";
import { ActivityName } from './activities';
import { listenSettings } from "./messaging";

const SETTINGS_FILE = "settings.cbor";

export interface Settings {
    useGps: false,
    location?: Location;
    activities: ActivityName[];
    background: string;
}

let settings: Settings = {
    useGps: false,
    activities: ["heart-rate", "steps", "floors"],
    background: "milky-way-bg.png",
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
                const activity = setting.data.background.values?.[0]?.value;
                if (activity) {
                    settings.background = activity;
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
