import clock from "clock";
import { gettext } from 'i18n';
import { battery } from "power";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { selectActivities } from "./activities";
import { getSunEvents, SunEvents } from "../common/sunevents";
import { LocationProvider } from "./location-provider";
import { listenSettings } from "./messaging";
import { getSetting } from "./settings";

// set the default sun icons & labels
util.setIcon("leftsunicon", "sunrise.png");
util.setIcon("rightsunicon", "sunset.png");
util.setUIElementText("time_left_label", gettext("Daylight_left"));

let sunEvents: SunEvents;
function draw(time?: Date) {
  util.setBackground(getSetting("background"));
  const today: Date = time || new Date() ;
  const hours = today.getHours();
  const hrStr = preferences.clockDisplay === "12h" ?  "" + (hours % 12 || 12) : util.zeroPad(hours);
  const mins = util.zeroPad(today.getMinutes());
  util.setUIElementText("hours", `${hrStr}`);
  util.setUIElementText("minutes", `${mins}`);
  util.setUIElementText("date", `${util.formatDate(today)}`);
  const activities = selectActivities(getSetting("activities"));
  util.updateActivities(activities);
  const pos = LocationProvider.getInstance().getLatestPos();
  if (pos) {
    sunEvents = getSunEvents(pos);
    util.setSuntimes(sunEvents);
  } else {
    util.setUIElementText("daynightlength",  gettext("No_location"));
  }
  const power = battery.charging ? "charging" : battery.chargeLevel;
  util.setBattery(power);
}

// Update the clock every minute
clock.granularity = "minutes";
clock.ontick = (evt) => {
  draw(evt.date);
}

listenSettings((err, settings) => {
  if (settings.response === "setting") {
    setTimeout(() => draw(), 0);
  }
})
