import * as messaging from "messaging";
import { geolocation } from "geolocation";

function sendLocation(pos) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send(pos);
    } else {
        console.error("sendLocation: Connection is not open");
    }
}

// get position and caluclate sunset and sunrise times
messaging.peerSocket.addEventListener("message", (evt) => {
    console.log("Event: " + JSON.stringify(evt.data));
    if (evt.data?.request === "location") {
        geolocation.getCurrentPosition((pos) => {
            console.log("Sending back the current location");
            sendLocation({
                response: "location",
                data: pos
            });
        },
        (err) => {
          console.log(err);
        },
        {enableHighAccuracy: false, maximumAge: Infinity});
    }
});
