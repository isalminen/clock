import { HeartRateSensor } from "heart-rate";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";

export type ActivityName = "heart-rate" | "steps" | "floors" | "distance" | "energy" ;
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
        switch(name) {
            case "energy":
                if (appbit.permissions.granted("access_activity") &&
                    today.adjusted.calories) {
                        return {
                            name,
                            value: today.adjusted.calories,
                            unit: "cal",
                        };
                }
                break;
            case "distance":
                if (appbit.permissions.granted("access_activity") &&
                    today.adjusted.distance) {
                        return {
                            name,
                            value: today.adjusted.distance,
                            unit: "m",
                        };
                }
                break;
            case "steps":
                if (appbit.permissions.granted("access_activity") &&
                    today.adjusted.steps) {
                        return {
                            name,
                            value: today.adjusted.steps,
                        };
                }
                break;
            case "floors":
                if (appbit.permissions.granted("access_activity") && 
                    today.local.elevationGain) {
                        return {
                            name,
                            value: today.adjusted.elevationGain,
                        };
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
                return {
                    name,
                    value: latestHeartRate,
                    unit: "bpm",
                };
            default:
                // nothing
        }
    });
    // check if we need to stop the hrm i.e it is no longer wanted
    if (hrm && activities.indexOf("heart-rate") < 0) {
        hrm.stop();
        hrm = undefined;
    }
    return selected;
}