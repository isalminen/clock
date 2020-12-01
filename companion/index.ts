import * as messaging from "messaging";
import { geolocation } from "geolocation";
import { settingsStorage } from "settings";
import { CompanionResponse } from "../common/types";
import { Geocode, geocode, revGeocode } from "./geocode";

const TIMEOUT = 50 * 1000;
const MAX_AGE = 3600 * 1000;
let lastGeocode: Geocode;

function sendLocation(pos) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        console.log("Sending data to the device");
        messaging.peerSocket.send(pos);
    } else {
        console.log("sendLocation: Connection is not open");
    }
}

messaging.peerSocket.onmessage = async (evt) => {
    console.log("Event: " + JSON.stringify(evt.data));
    if (evt.data?.request === "location") {
        console.log("Getting the current pos");
        const pos = await getLocation();
        if (pos) {
            sendLocation(pos);
        }
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
    if (evt.key === "locationName" && evt.newValue !== lastGeocode?.label) {
        lastGeocode = await geocode(evt.newValue);
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
});

function saveGeocode(geocode: Geocode) {
    console.log("Saving: " + JSON.stringify(geocode));
    settingsStorage.setItem("locationName", geocode.label);
    settingsStorage.setItem("location", JSON.stringify(geocode.coords));
}