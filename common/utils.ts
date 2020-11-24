import document from "document";
import { gettext } from "i18n";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Add zero in front of numbers < 10
export function zeroPad(i: number): string {
    return `${i < 10 ? "0" + i : i}`;
}

export function formatDate(date: Date): string {
    const weekday = gettext(weekdays[date.getDay()]);
    const dayStr = `${date.getDate()}`;
    const monStr = gettext(months[date.getMonth()]);
    let suffix: string;
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
    return `${weekday}, ${monStr} ${dayStr}${suffix}`;
}

export function setUIElementText(id: string, value: string) {
    const el = document.getElementById(id);
    if (el) {
        el.text = value;
    }
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
