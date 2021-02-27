import * as messaging from "messaging";
import { geolocation } from "geolocation";
import { settingsStorage } from "settings";
import { CompanionResponse } from "../common/types";
import { Geocode, geocode, revGeocode } from "./geocode";

const TIMEOUT = 50 * 1000;
const MAX_AGE = 3600 * 1000;
let lastGeocode: Geocode;

function sendData(data: CompanionResponse) {
    console.log("Sending data to the device");
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send(data);
    } else {
        console.log("sendData: Connection is not open");
    }
}

function getSettings() {
    const n = settingsStorage.length;
    const settings = [];
    for(let i = 0; i < n; ++i) {
        const key = settingsStorage.key(i);
        if (key) {
            const val = settingsStorage.getItem(key);
            if (val) {
                // @todo: saner settings. Either they are JSON or not but not like this!
                console.log(`${key}: ${val}`);
                let jsonVal: any;
                try {
                    jsonVal = JSON.parse(val);
                } catch(err) {
                    jsonVal = val;
                }
                settings.push({[key]: jsonVal});
            }
        }
    }
    return settings;
}

messaging.peerSocket.onmessage = async (evt) => {
    console.log("Event: " + JSON.stringify(evt.data));
    switch(evt.data?.request) {
        case "location":
            console.log("Getting the current pos");
            const pos = await getLocation();
            if (pos) {
                sendData(pos);
            }
            break;
        case "settings":
            console.log("Getting all settings");
            const settings = getSettings();
            if (settings) {
                settings.forEach((s) => {
                    sendData({
                        response: "setting",
                        data: s
                    });
                });
            }
            break;
        default:
            // do nothing
    }
};

messaging.peerSocket.addEventListener("error", (err) => {
    console.log(err);
});

messaging.peerSocket.onopen = () => {
    console.log("Connection open");
};

async function getLocation(): Promise<CompanionResponse|undefined> {
    return new Promise(async (resolve, reject) => {
        const resolvedLocation = JSON.parse(settingsStorage.getItem("location"));
        const useGPS = settingsStorage.getItem("useGPS");
    
        if (useGPS === "true") {
            geolocation.getCurrentPosition(async (pos) => {
                console.log("Sending back the current location: " + JSON.stringify(pos));
                const revGeo = await revGeocode(pos.coords.latitude, pos.coords.longitude);
                saveGeocode(revGeo);
                return resolve({
                    response: "location",
                    data: pos
                });
            },
            (err) => {
              console.log(err);
              return reject(err);
            },
            {timeout: TIMEOUT, maximumAge: MAX_AGE});
        } else {
            if (resolvedLocation?.latitude && resolvedLocation?.longitude) {
                console.log("Return the resolved location");
                console.log(JSON.stringify(resolvedLocation));
                return resolve({
                    response: "location",
                    data: {
                        coords: resolvedLocation
                    }
                });
            }
            return resolve(undefined);
        }
    });
}

settingsStorage.addEventListener("change", async (evt) => {
    console.log("Setting change: " + JSON.stringify(evt));
    if (evt.key === "locationName") { // && evt.newValue?.name !== lastGeocode?.label) {
        const newVal = JSON.parse(evt.newValue);
        console.log("Name: " + newVal.name);
        lastGeocode = await geocode(newVal?.name);
        saveGeocode(lastGeocode);
    }
    // prefetch the new gps pos
    if (evt.key === "useGPS" && evt.newValue ==="true") {
        geolocation.getCurrentPosition(async (pos) => {
            const revGeo = await revGeocode(pos.coords.latitude, pos.coords.longitude);
            saveGeocode(revGeo);
        },
        (err) => {
          console.log(err);
        },
        {timeout: TIMEOUT, maximumAge: MAX_AGE});
    }
    sendData({
        response: "setting",
        data: {
            [evt.key]: JSON.parse(evt.newValue),
        }
    });
});

function saveGeocode(geocode: Geocode) {
    console.log("Saving: " + JSON.stringify(geocode));
    settingsStorage.setItem("locationName", geocode.label);
    settingsStorage.setItem("location", JSON.stringify(geocode.coords));
    console.log("Sending loc to the device");
    sendData({
        response: "setting",
        data: {
            location: geocode.coords,
        }
    })
}