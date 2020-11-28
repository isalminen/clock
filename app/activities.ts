import { HeartRateSensor } from "heart-rate";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";

export type ActivityName = "heart-rate" | "steps" | "floors";

export type Activities = {
    [name in ActivityName]?: {
        value: number;
        unit?: string;
    };
};

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

export function selectActivities(activities: [ActivityName, ActivityName, ActivityName]): Activities {
    const values = activities.reduce((acc, current) => {
        acc[current] = {
            value: undefined,
        };
        switch(current) {
            case "steps":
                if (appbit.permissions.granted("access_activity") &&
                    today.adjusted.steps) {
                        acc[current].value = today.adjusted.steps;
                }
                break;
            case "floors":
                if (appbit.permissions.granted("access_activity") && 
                    today.local.elevationGain) {
                        acc[current].value = today.adjusted.elevationGain;
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
                acc[current].value = latestHeartRate;
                break;
            default:
                // nothing
        }
        return acc;
    }, {});
    
    // check if we need to stop the hrm i.e it is no longer wanted
    if (hrm && !values["heart-rate"]) {
        hrm.stop();
        hrm = undefined;
    }
    return values;
}