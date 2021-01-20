import { CompanionResponse, Location } from "../common/types";
import { send } from "./messaging";
import { getSettings } from "./settings";

const HOUR = 3600 * 1000;
const MINUTE = 60 * 1000;

export class LocationProvider {
    private static instance: LocationProvider = undefined;
    private latestPos: Location;
    private lastPosUpdate: number = 0;

    protected constructor() {
        this.latestPos = getSettings()?.location;
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

    public setLocation(loc: Location) {
        this.latestPos = { ...loc };
        this.lastPosUpdate = Date.now();
    }

    private locationUpdated(response: CompanionResponse) {
        console.log("Loc updated: " + JSON.stringify(response));
        if (response?.response === "location") {
            if (response.data?.coords) {
                this.setLocation(response.data.coords);
            }
        }
    }

    private subscribeToLocations() {
        const { useGps, location } = getSettings();
        if (useGps || !location) {
            console.log("Asking a location from the companion");
            send({request: "location"}, (err, loc) => {
                if (err) {
                    console.log("Loc comm error: " + JSON.stringify(err));
                } else {
                    console.log("Loc update: " + JSON.stringify(loc));
                    this.locationUpdated(loc);
                }
            });
        } else if (location) {
            console.log("Current loc: " + JSON.stringify(location));
            this.setLocation(location);
        }
        
        setTimeout(() => {
            this.subscribeToLocations();
        }, this.latestPos ? HOUR : MINUTE);
    }
}
