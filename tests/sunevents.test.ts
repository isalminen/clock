import { ZENITH } from "../common/sun-noaa";
import * as sunevents from "../common/sunevents";
import { Location } from "../common/types";

const TAMPERE: Location = {
    latitude: 61.49911,
    longitude: 23.78712
}

describe("Sunevents", () => {
    it("Finds sunrise and sunset for the day when the asked is during the daylight", () => {
        let date = new Date(Date.UTC(2021,8,24,12,0));
        let events = sunevents.getSunEvents(TAMPERE, date, ZENITH.STANDARD);
        expect(events.length).toBe(2);
        expect(events[0].type).toBe("sunrise");
        expect(events[1].type).toBe("sunset");
        expect(events[0].time.getUTCHours()).toBe(4);
        expect(events[0].time.getUTCMinutes()).toBe(12);
        expect(events[1].time.getUTCHours()).toBe(16);
        expect(events[1].time.getUTCMinutes()).toBe(22);
    });

    it("Find previous sunset and next sunrise when asked before sunrise", () => {
        let date = new Date(Date.UTC(2021,8,24,1,0));
        let events = sunevents.getSunEvents(TAMPERE, date, ZENITH.STANDARD);
        expect(events.length).toBe(2);
        expect(events[0].type).toBe("sunset");
        expect(events[1].type).toBe("sunrise");
        expect(events[0].time.getUTCHours()).toBe(16);
        expect(events[0].time.getUTCMinutes()).toBe(26);
        expect(events[1].time.getUTCHours()).toBe(4);
        expect(events[1].time.getUTCMinutes()).toBe(11);
    });

    it("Find next sunrise and previous sunset when asked after the sunset", () => {
        let date = new Date(Date.UTC(2021,8,24,22,0));
        let events = sunevents.getSunEvents(TAMPERE, date, ZENITH.STANDARD);
        expect(events.length).toBe(2);
        expect(events[0].type).toBe("sunset");
        expect(events[1].type).toBe("sunrise");
        expect(events[0].time.getUTCHours()).toBe(16);
        expect(events[0].time.getUTCMinutes()).toBe(20);
        expect(events[1].time.getUTCHours()).toBe(4);
        expect(events[1].time.getUTCMinutes()).toBe(15);
    });
});