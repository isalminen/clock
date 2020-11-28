import { CompanionResponse, Location } from "../common/types";
import { send, Callback } from "./messaging";

const HOUR = 3600 * 1000;
const MINUTE = 60 * 1000;

export class LocationProvider {
    private static instance: LocationProvider = undefined;
    private latestPos: Location;
    private lastPosUpdate: number = 0;

    protected constructor() {
        this.latestPos = undefined;
        this.subscribeToLocations();
    }

    static getInstance(): LocationProvider {
        if (!this.instance) {
            this.instance = new LocationProvider();
        }
        return this.instance;
    }

    public getLatestPos(): Location {
        return this.latestPos;
    }

    private locationUpdated(response: CompanionResponse) {
        if (response?.response === "location") {
            if (response.data?.coords) {
                this.latestPos = {
                    lat: response.data.coords?.latitude,
                    lon: response.data.coords?.longitude,
                };
                this.lastPosUpdate = Date.now();
            }
        }
    }

    private subscribeToLocations() {
        console.log("Asking a location from the companion");
        send({request: "location"}, (err, loc) => {
            if (err) {
                console.log("Loc comm error: " + JSON.stringify(err));
            } else {
                console.log("Loc update: " + JSON.stringify(loc));
                this.locationUpdated(loc);
            }
        });
        setTimeout(() => {
            this.subscribeToLocations();
        }, this.latestPos ? HOUR : MINUTE);
    }
}
