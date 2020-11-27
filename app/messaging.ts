import * as messaging from "messaging";
import { CompanionRequest } from "../common/messaging";
import { Location } from "../common/sunevents";

export type LocationCallback = (loc: Location) => void;

const listeners: { location: LocationCallback[]} = {
    location: [],
}

function sendMessage<T,U>(msg: CompanionRequest<T,U>) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      // Send the data to peer as a message
      messaging.peerSocket.send(msg);
    }
}

messaging.peerSocket.addEventListener("message", (evt) => {
    console.log("Got a message from the companion: " + JSON.stringify(evt.data));
    if (evt.data?.response === "location") {
        const pos = evt.data.data;
        while(listeners.location.length > 0) {
            const listener = listeners.location.shift();
            listener({lat: pos.coords.latitude, lon: pos.coords.longitude});
        }
    }
});


messaging.peerSocket.addEventListener("error", (err) => {
    console.log("Conn error: " + JSON.stringify(err));
});

export const requestLocation = (cb: LocationCallback) => {
    const size = listeners.location.push(cb);
    console.log("Listener count: " + size);

    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        console.log("Connection already open");
        sendMessage<"location", void>({request: "location"});
    } else {
        console.log("Open the connection");
        messaging.peerSocket.addEventListener("open", (evt) => {
            sendMessage<"location", void>({request: "location"});
        });
    }
}

