/* 
* Sunrise and sunset calculations based on Excel formulas by NOAA
* https://www.esrl.noaa.gov/gmd/grad/solcalc/calcdetails.html
*
* Copyright 2020 Ilkka Salminen ike@iki.fi
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
* and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial
* portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
* TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
* THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*/

// bit less typing with aliasing sin and cos functions
const sin  = Math.sin;
const cos  = Math.cos;
const tan  = Math.tan;
const asin = Math.asin;
const acos = Math.acos;
// I like x,y instead of JS's y,x
const atan2 = (x: number, y: number) => Math.atan2(y,x);

export enum ZENITH {
    STANDARD              = 90.8333,
    CIVIL_TWILIGHT        = 96,
    NAUTICAL_TWILIGHT     = 102,
    ASTRONOMICAL_TWILIGHT = 108,
}

export interface Position {
    longitude: number;
    latitude: number;
}

// degrees to radians
function d2r(deg: number): number { 
    return deg * Math.PI / 180.0;
}

// radians to degrees
function r2d(rad: number): number {
    return rad / Math.PI * 180;
}

/**
 * https://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
 * @param {date} date 
 * @return julian day number of the date
 */
function julianDay(date: Date): number {
    let y = date.getFullYear();
    let m = date.getUTCMonth() + 1;
    if (m <= 2) { // Jan and Feb -> 13th and 14th months of the previous year
        y--;
        m += 12;
    }
    const d = date.getUTCDate();
    const h = date.getUTCHours();
    const a = Math.floor(y / 100);
    const b = Math.floor(a / 4);
    const c = 2 - a + b;
    const e = 365.25 * (y +  4716);
    const f = 30.6001 * (m + 1); 
    return Math.floor(c + d + e + f - 1524.5) + (h - 12) / 24;
}

export function calculate(pos: Position, date: Date, zenith: number): [Date, Date] {
    const jCentury = (julianDay(date) - 2451545) / 36525;
    const sunMeanLong = (280.46646 + jCentury * (36000.76983 + jCentury * 0.0003032)) % 360;
    const sunMeanAnomaly = 357.52911 + jCentury * (35999.05029 - 0.0001537 * jCentury);
    const earthEccentrity = 0.016708634 - jCentury * (0.000042037 + 0.0000001267 * jCentury);
    const sunEqOfCenter = sin(d2r(sunMeanAnomaly)) * (1.914602 - jCentury * (0.004817 + 0.000014 * jCentury)) +
                          sin(d2r(2 * sunMeanAnomaly)) * (0.019993 - 0.000101 * jCentury) + sin(d2r(3 * sunMeanAnomaly)) * 0.000289;
    const sunTrueLong = sunMeanLong + sunEqOfCenter;
    const sunApparentLong = sunTrueLong - 0.00569 - 0.00478 * sin(d2r(125.04 - 1934.136 * jCentury));
    const meanObliq = 23 + (26 + ((21.448 - jCentury * (46.815 + jCentury * (0.00059 - jCentury * 0.001813)))) / 60) / 60;
    const correctedObliq = meanObliq + 0.00256 * cos(d2r(125.04 - 1934.136 * jCentury));
    const sunDeclination = r2d(asin(sin(d2r(correctedObliq)) * sin(d2r(sunApparentLong))));
    const y = tan(d2r(correctedObliq / 2)) * tan(d2r(correctedObliq / 2));
    const eqTime = 4 * r2d(y * sin(2 * d2r(sunMeanLong)) - 2 * earthEccentrity * sin(d2r(sunMeanAnomaly)) +
                   4 * earthEccentrity * y * sin(d2r(sunMeanAnomaly)) * cos(2 * d2r(sunMeanLong)) -
                   0.5 * y * y * sin(4 * d2r(sunMeanLong)) - 1.25 * earthEccentrity * earthEccentrity * sin(2 * r2d(sunMeanAnomaly)));
    const ha = r2d(acos(cos(d2r(zenith)) / (cos(d2r(pos.latitude)) * cos(d2r(sunDeclination))) -
                   tan(d2r(pos.latitude)) * tan(d2r(sunDeclination))));
    const solarNoon = (720 - 4 * pos.longitude - eqTime)/1440;
    const sunriseFrac = solarNoon - ha * 4/1440;
    const sunsetFrac = solarNoon + ha * 4/1440;
    const midnightUTC = Date.UTC(date.getFullYear(), date.getUTCMonth(), date.getUTCDate());
    const sunrise = new Date(midnightUTC + sunriseFrac * 24 * 3600 * 1000);
    const sunset = new Date(midnightUTC + sunsetFrac * 24 * 3600 * 1000);
    return [sunrise, sunset];
}
