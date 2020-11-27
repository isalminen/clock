import clock from "clock";
import { gettext } from 'i18n';
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { selectActivities } from "./activities";
import { getSunEvents, SunEvents } from "../common/sunevents";
import { requestLocation } from "./messaging";

const HOUR = 3600 * 1000 * 0;
// set the default sun icons & labels
util.setIcon("leftsunicon", "sunrise.png");
util.setIcon("rightsunicon", "sunset.png");
util.setUIElementText("left_label", gettext("Sunrise"));
util.setUIElementText("right_label", gettext("Sunset"));
util.setUIElementText("time_left_label", gettext("Daylight_left"));

let sunEvents: SunEvents;
let lastPosRequest = 0;

// Update the clock every minute
clock.granularity = "minutes";
clock.ontick = (evt) => {
  const today: Date = evt.date;
  const hours = today.getHours();
  const hrStr = preferences.clockDisplay === "12h" ?  "" + (hours % 12 || 12) : util.zeroPad(hours);
  const mins = util.zeroPad(today.getMinutes());
  util.setUIElementText("hours", `${hrStr}`);
  util.setUIElementText("minutes", `${mins}`);
  util.setUIElementText("date", `${util.formatDate(today)}`);
  const activities = selectActivities(["heart-rate", "steps", "floors"]);
  util.setUIElementText("sensor_1", `${activities["heart-rate"].value ? activities["heart-rate"].value : "--"}`);
  util.setUIElementText("sensor_2", `${activities["steps"].value ? activities["steps"].value : "--"}`);
  util.setUIElementText("sensor_3", `${activities["floors"].value ? activities["floors"].value : "--"}`);

  sunEvents && sunEvents[1] ?
    util.setUIElementText("daynightlength", `${util.lengthToHrMin(sunEvents[1].time.valueOf() - Date.now())}`) :
    util.setUIElementText("daynightlength",  gettext("No_location"));

  if (lastPosRequest + HOUR < Date.now()) {
    lastPosRequest = Date.now();
    console.log("Request location from the companion");
    requestLocation((pos) => {
      console.log("Got pos: " + JSON.stringify(pos));
      sunEvents = getSunEvents(pos);
      util.setSuntimes(sunEvents);      
    });
  }
}
