import * as messaging from "messaging";
import { geolocation } from "geolocation";

function sendLocation(pos) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        console.log("Sending data to the device");
        messaging.peerSocket.send(pos);
    } else {
        console.log("sendLocation: Connection is not open");
    }
}

// get position and caluclate sunset and sunrise times
messaging.peerSocket.onmessage = (evt) => {
    console.log("Event: " + JSON.stringify(evt.data));
    if (evt.data?.request === "location") {
        console.log("Getting the current pos");
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
        {maximumAge: Infinity});
    }
};

messaging.peerSocket.addEventListener("error", (err) => {
    console.log(err);
});

messaging.peerSocket.onopen = () => {
    console.log("Connection open");
};
