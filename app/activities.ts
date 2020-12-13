import { HeartRateSensor } from "heart-rate";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";

export type ActivityName = "heart-rate" | "steps" | "floors" | "distance" | "energy" | "zones" ;
export type Activity = {
    name: ActivityName;
    value: number;
    unit?: string;
}

let hrm: HeartRateSensor = null;
let body: BodyPresenceSensor = null;
let latestHeartRate: number;

if (BodyPresenceSensor) {
    body = new BodyPresenceSensor();
    body.addEventListener("reading", () => {
      if (!body.present) {
        hrm && hrm.stop();
      } else {
        hrm && hrm.start();
      }
    });
    body.start();
}

display.addEventListener("change", () => {
    if (display.on) {
        hrm?.start();
        body?.start();
    } else {
        hrm?.stop();
        body?.stop();
    }
});

export function selectActivities(activities: [ActivityName, ActivityName, ActivityName]): Activity[] {
    const selected = activities.map((name) => {
        const activity: Activity = {
            name,
            value: undefined,
        };
        switch(name) {
            case "energy":
                if (appbit.permissions.granted("access_activity") &&
                    today.adjusted.calories !== undefined) {
                        activity.value = today.adjusted.calories;
                        activity.unit = "cal";
                }
                break;
            case "distance":
                if (appbit.permissions.granted("access_activity") &&
                    today.adjusted.distance !== undefined) {
                        activity.value = today.adjusted.distance;
                        activity.unit = "m";
                }
                break;
            case "steps":
                if (appbit.permissions.granted("access_activity") &&
                    today.adjusted.steps !== undefined) {
                        activity.value = today.adjusted.steps;
                }
                break;
            case "floors":
                if (appbit.permissions.granted("access_activity") && 
                    today.local.elevationGain !== undefined) {
                        activity.value = today.adjusted.elevationGain;
                }
                break;
            case "zones":
                if (appbit.permissions.granted("access_activity") && 
                    today.local.activeZoneMinutes.total !== undefined) {
                        activity.value = today.adjusted.activeZoneMinutes.total;
                        activity.unit = "min";
                }
                break;
            case "heart-rate":
                if (!hrm && HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
                    hrm = new HeartRateSensor({ frequency: 1 });
                    hrm.addEventListener("reading", () => {
                        latestHeartRate = hrm.heartRate;
                    });
                    hrm.start();
                }
                activity.value = latestHeartRate;
                activity.unit = "bpm";
            default:
                // nothing
        }
        return activity;
    });
    // check if we need to stop the hrm i.e it is no longer wanted
    if (hrm && activities.indexOf("heart-rate") < 0) {
        hrm.stop();
        hrm = undefined;
    }
    return selected;
}