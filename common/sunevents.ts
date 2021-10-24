import { calculate, ZENITH } from "./sun-noaa";
import { Location } from "./types";
import { getSetting } from "../app/settings";

export interface SunEvent {
    type: "sunset" | "sunrise";
    time: Date;
}

export type SunEvents = [SunEvent, SunEvent];

export function getSunEvents(pos: Location, date = new Date(), zenith = ZENITH.STANDARD): SunEvents {
    const retData: SunEvent[] = [];
    // assume now is between sunrise and sunset
    const [sunrise, sunset] = calculate(pos, date, zenith);
    retData.push({type: "sunrise", time: sunrise});
    retData.push({type: "sunset", time: sunset});

    // if the sunrise in future, it is after midnight before the sunrise
    // we want yesterday's sunset as a first value and the sunrise the second
    if (sunrise.valueOf() > date.valueOf()) {
        const yesterday = new Date(date);
        // this works across month/year boundaries
        yesterday.setDate(date.getDate() - 1);
        const [_, yesterdaySunset] = calculate(pos, yesterday, zenith);
        retData[1] = retData[0];
        retData[0] = {type: "sunset", time: yesterdaySunset};
    }

    // if the sunset is in the past, we want the next day's sunrise
    // as a second value
    if (sunset.valueOf() < date.valueOf()) {
        const tomorrow = new Date(date);
        // this works across month/year boundaries
        tomorrow.setDate(date.getDate() + 1);
        const [nextSunrise, _] = calculate(pos, tomorrow, zenith);
        retData[0] = retData[1];
        retData[1] = {type: "sunrise", time: nextSunrise};
    }
    return retData as SunEvents;
}