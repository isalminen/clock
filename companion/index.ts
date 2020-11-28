import * as messaging from "messaging";
import { geolocation } from "geolocation";
import { me as companion } from "companion";

const TIMEOUT = 50 * 1000;
const MAX_AGE = 3600 * 1000;

if (
  !companion.permissions.granted("access_location") ||
  !companion.permissions.granted("run_background")
) {
  console.error("We're not allowed to access to GPS Position!");
}

function sendLocation(pos) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        console.log("Sending data to the device");
        messaging.peerSocket.send(pos);
    } else {
        console.log("sendLocation: Connection is not open");
    }
}

messaging.peerSocket.onmessage = (evt) => {
    console.log("Event: " + JSON.stringify(evt.data));
    if (evt.data?.request === "location") {
        console.log("Getting the current pos");
        geolocation.getCurrentPosition((pos) => {
            console.log("Sending back the current location: " + JSON.stringify(pos));
            sendLocation({
                response: "location",
                data: pos
            });
        },
        (err) => {
          console.log(err);
        },
        {timeout: TIMEOUT, maximumAge: MAX_AGE});
    }
};

messaging.peerSocket.addEventListener("error", (err) => {
    console.log(err);
});

messaging.peerSocket.onopen = () => {
    console.log("Connection open");
};
