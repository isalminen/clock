import { apikey } from "./apikey";

const GEOCODE_URL = "https://geocode.search.hereapi.com/v1/geocode";
const REV_GEOCODE_URL = "https://revgeocode.search.hereapi.com/v1/revgeocode";

export interface Geocode {
    label: string;
    coords: {
        latitude: number;
        longitude: number;
    };
};

export async function geocode(locationName: string): Promise<Geocode> {
    return new Promise(async (resolve, reject) => {
        if (!locationName) {
            console.log("No location given");
            return reject("No location given");
        }
        console.log(`Geocode for: ${GEOCODE_URL}?qq=city=${locationName}&apiKey=${apikey}`);
        const locResponse = await fetch(`${GEOCODE_URL}?qq=city=${locationName}&apiKey=${apikey}`);
        if (!locResponse.ok) {
            console.log("Geocode failed: " + JSON.stringify(locResponse));
            return reject(locResponse.statusText);
        }
        const locJSON = await locResponse.json();
        console.log(JSON.stringify(locJSON));
        const locName = locJSON.items?.[0]?.title;
        const coords = locJSON.items?.[0]?.position;
        return resolve({
            label: locName,
            coords: {
                latitude: coords?.lat,
                longitude: coords?.lng,
            },
        });
    });
}

export async function revGeocode(lat: number, lon: number): Promise<Geocode> {
    return new Promise(async (resolve, reject) => {
        const locResponse = await fetch(`${REV_GEOCODE_URL}?at=${lat},${lon}&apiKey=${apikey}`);
        if (!locResponse.ok) {
            return reject(locResponse.statusText);
        }
        const locJSON = await locResponse.json();
        console.log(JSON.stringify(locJSON));
        const locName = locJSON.items?.[0].address.label || locJSON.items?.[0]?.title || "Unknown place";
        return resolve({
            label: locName,
            coords: {
                latitude: lat,
                longitude: lon,
            }
        });
    });
}
