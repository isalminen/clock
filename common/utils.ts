import document from "document";
import { gettext } from "i18n";
import { SunEvents } from './sunevents';
import { getSetting } from "../app/settings";
import { Activity } from "../app/activities";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

 
export function zeroPad(i: number): string {
    return `${i < 10 ? "0" + i : i}`;
}

export function formatDate(date: Date): string {
    const weekday = gettext(weekdays[date.getDay()]);
    const dayStr = `${date.getDate()}`;
    const monStr = gettext(months[date.getMonth()]);
    let suffix: string;
    if (date.getDate() < 10 || date.getDate() >= 20) {
        switch (dayStr[dayStr.length - 1]) {
            case "1":
                suffix = "st";
                break;
            case "2":
                suffix = "nd";
                break;
            case "3":
                suffix = "rd";
                break;
            default:
                suffix = "th";
        }
    } else {
        suffix = "th";
    }
    return `${weekday}, ${monStr} ${dayStr}${suffix}`;
}

export function updateActivities(activities: Activity[]) {
    activities.forEach((activity, i) => {
        setIcon(`sensor${i + 1}_icon`, `${activity.name}.png`);
        setUIElementText(`sensor${i + 1}`, `${activity.value !== undefined ? activity.value : "--"}`);    
    });
}

export function setUIElementText(id: string, value: string) {
    const el = document.getElementById(id);
    const colour = getSetting(id + "Colour");
    if (el) {
        el.text = value;
        if(colour) {
            (el as any).style.fill = colour;
        }
    }
}

export function setClassColour(className: string, colour: string) {
    const elems = document.getElementsByClassName(className);
    elems.forEach((el: any) => {
        if (el.style) {
            el.style.fill = colour;
        }
    });
}
  
export function lengthToHrMin(duration: number): string {
    const hrs = Math.floor(duration / 3600000);
    const mins = Math.floor((duration - (hrs * 3600000)) / 60000);
    return `${hrs}h ${mins}m`;
}

export function setIcon(id: string, icon: string): void {
    const el = document.getElementById(id);
    if (el) {
        (el as any).href = icon;
    }
}

export function setSuntimes(sunEvents: SunEvents): void {
    if (sunEvents[0].type === "sunrise") {
        setIcon("leftsunicon", "sunrise.png");
        setIcon("rightsunicon", "sunset.png");
        setUIElementText("time_left_label", gettext("Daylight_left"));
      } else {
        setIcon("leftsunicon", "sunset.png");
        setIcon("rightsunicon", "sunrise.png");
        setUIElementText("time_left_label", gettext("Until_dawn"));      
    }
    
    const leftTime = sunEvents[0].time.valueOf() ?
        `${zeroPad(sunEvents[0].time.getHours())}:${zeroPad(sunEvents[0].time.getMinutes())}`
    : "--";
    setUIElementText("leftsuntime", leftTime);
    const rightTime = sunEvents[1].time.valueOf() ? 
        `${zeroPad(sunEvents[1].time.getHours())}:${zeroPad(sunEvents[1].time.getMinutes())}`
    : "--";
    setUIElementText("rightsuntime", rightTime);
    const length = sunEvents[1].time.valueOf() ?
        `${lengthToHrMin(sunEvents[1].time.valueOf() - Date.now())}`
    : "--";
    setUIElementText("daynightlength", length);
}

export function setBattery(power: number, charging: boolean) {
    let icon = "battery-full.png"
    let value = `${power}%`;
    if (charging) {
        icon = "charging.png";
    } else {
        if (power <= 25) {
            icon = "battery-low.png";
        } else if (power <= 50) {
            icon = "battery-50.png";
        } else if (power <= 75) {
            icon = "battery-75.png";
        } else {
            icon = "battery-full.png";
        }
    }
    setIcon("battery_icon", icon);
    setUIElementText("battery_value", value);
}

export function setBackground(bg: string) {
    const el: ImageElement = document.getElementById("background") as ImageElement;
    if (el && el.href !== bg && bg) {
        el.href = bg;
    }
}

export function round(n: number, decimals: number): number {
    const scale = Math.pow(10, decimals);
    return Math.round(n * scale) / scale;
}

export function scaleDistance(dist: number, unit: "m" | "ft", threshold: number): { value: string, unit: string } {
    let newUnit: string = unit;
    let val = dist;
    if ( dist > threshold) {
        val = unit === "m" ? val / 1000 : val / 5280; // 1 mile === 5280 feet
        newUnit = unit === "m" ? "km" : "miles";
    }
    return {
        value: dist <= threshold ? "" + val : Number(val).toFixed(2),
        unit: newUnit,
    }
}
export function meters2feet(meters: number): number {
    return Math.round(meters * 3.281);
}
