import {geocode, revGeocode} from "../companion/geocode";

import treResult from "./tampere.json";
import gpsRsult from "./gps.json";

const tampereResponse: Response = {
    ok: true,
    json: () => Promise.resolve(treResult),
}

const gpsResponse: Response = {
    ok: true,
    json: () => Promise.resolve(gpsRsult),
}
global.fetch = jest.fn();

describe("Geocoding", () => {
    it("Can get gps coordinates of the location", async () => {
        (global.fetch as any).mockReturnValueOnce(tampereResponse);
        const tre = await geocode("Tampere,Finland");
        expect(tre).toEqual({
            label: "Tampere, Länsi- ja Sisä-Suomi, Suomi",
            coords: {
                latitude: 61.49844,
                longitude: 23.77176,
            },
        });
    });

    it("Can get the location from gps coordinates", async () => {
        (global.fetch as any).mockReturnValueOnce(gpsResponse);
        const gps = await revGeocode(61.50, 23.77);
        expect(gps).toEqual({
            label: "Tuomiokirkonkatu 22, FI-33100 Tampere, Suomi",
            coords: {
                latitude: 61.50,
                longitude: 23.77,
            },
        });
    });
});

