import { getSunrise, getSunset } from "./sunrise-sunset";
import { Location } from "./types";

export interface SunEvent {
    type: "sunset" | "sunrise";
    time: Date;
}

export type SunEvents = [SunEvent, SunEvent];

export function getSunEvents(pos: Location): SunEvents {
    const retData: SunEvent[] = [];
    const today = new Date();
    // assume now is between sunrise and sunset
    let sunrise = getSunrise(pos.latitude, pos.longitude, today);
    retData.push({type: "sunrise", time: sunrise});
    let sunset = getSunset(pos.latitude, pos.longitude, today);
    retData.push({type: "sunset", time: sunset});

    // if the sunrise in future, it is after midnight before the sunrise
    // we want yesterday's sunset as a first value and the sunrise the second
    if (sunrise.valueOf() > today.valueOf()) {
        const yesterday = new Date();
        // this works across month/year boundaries
        yesterday.setDate(today.getDate() - 1);
        const yesterSunset = getSunset(pos.latitude, pos.longitude, yesterday);
        retData[1] = retData[0];
        retData[0] = {type: "sunset", time: yesterSunset};
    }

    // if the sunset is in the past, we want the next day's sunrise
    // as a second value
    if (sunset.valueOf() < today.valueOf()) {
        const tomorrow = new Date();
        // this works across month/year boundaries
        tomorrow.setDate(today.getDate() + 1);
        const nextSunrise = getSunrise(pos.latitude, pos.longitude, tomorrow);
        retData[0] = retData[1];
        retData[1] = {type: "sunrise", time: nextSunrise};
    }
    return retData as SunEvents;
}