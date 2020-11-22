import clock from "clock";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
clock.granularity = "minutes";

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  const today: Date = evt.date;
  const hours = today.getHours();
  const hrStr = preferences.clockDisplay === "12h" ?  "" + (hours % 12 || 12) : util.zeroPad(hours);
  const mins = util.zeroPad(today.getMinutes());
  util.setUIElementText("hours", `${hrStr}`);
  util.setUIElementText("minutes", `${mins}`);
  util.setUIElementText("date", `${util.formatDate(today)}`);
}

// demo content
util.setUIElementText("leftsuntime", "08:32");
util.setUIElementText("daynightlength", "10h 32m");
util.setUIElementText("rightsuntime", "19:04");
util.setUIElementText("sensor_1", "64");
util.setUIElementText("sensor_2", "10 232");
util.setUIElementText("sensor_3", "31");