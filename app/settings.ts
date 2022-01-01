import * as fs from "fs";
import { CompanionResponse, Location } from "../common/types";
import { ActivityName } from './activities';
import { listenSettings, send } from "./messaging";
import { LocationProvider } from "./location-provider";

const SETTINGS_FILE = "settings.cbor";

export const OWN_IMAGE = "__own_image__";

export interface Settings {
    useGPS: boolean,
    location?: Location;
    activities: ActivityName[];
    background: string;
    zenith: number;
    showRHR: boolean;
    minutesColour: string;
    hoursColour: string;
    sensorDataColour: string;
    statusColour: string;
    ownImage?: string;
}

const defaultSettings: Settings = {
    useGPS: false,
    activities: ["heart-rate", "steps", "floors"],
    background: "milky-way-bg.png",
    zenith: 90.833,
    showRHR: false,
    hoursColour: "white",
    sensorDataColour: "white",
    statusColour: "white",
    minutesColour: "white",
}

let settings = undefined;

console.log("Init settings");
if (fs.existsSync(SETTINGS_FILE)) {
    let readSettings = fs.readFileSync(SETTINGS_FILE, "cbor");
    console.log("Read local settings: " + JSON.stringify(readSettings));
    settings = {...defaultSettings, ...readSettings};
} else {
    console.log("Creating default settings");
    settings = {...defaultSettings};
    fs.writeFileSync(SETTINGS_FILE, settings, "cbor");
}

const saveSettings = () => {
    console.log("Saving settings:");
    console.log(JSON.stringify(settings));
    fs.writeFileSync(SETTINGS_FILE, settings, "cbor");
}

// ask companion settings
send({request: "settings"}, null);
console.log("Init settings done");

listenSettings((err, setting: CompanionResponse) => {
    console.log("Settings: got this setting: " + JSON.stringify(setting));
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
        } else if (setting.data.ownImage) {
            const ownImage = setting.data.ownImage;
            if (ownImage) {
                if (settings.ownImage) {
                    console.log("Removing the old image: " + settings.ownImage);
                    try {
                        fs.unlinkSync(settings.ownImage);
                    } catch(e) {
                        console.log(e.message);
                    }
                }
                settings.ownImage = ownImage;
            }
        } else if (setting.data.zenith) {
            const zenith = setting.data.zenith.values?.[0]?.value;
            if (zenith) {
                settings.zenith = parseInt(zenith);
            }
        } else if (setting.data.location) {
            const location = setting.data.location;
            settings.location = location;
            console.log("Saving location: " + JSON.stringify(settings.location));
            LocationProvider.getInstance().setLocation(location);
        } else {
            console.log("Updating setting");
            console.log(JSON.stringify({...setting.data}));
            settings = {...settings, ...setting.data};
        }
        try {
            saveSettings();
        } catch (e) {
            console.log("Can't save settings: " + JSON.stringify(e));
        }
    }
});

export function getSettings(): Settings {
    return settings;
}

export function getSetting(name: string): any | undefined {
    // console.log(`setting ${name} = ${settings[name]}`);
    return settings[name];
}
