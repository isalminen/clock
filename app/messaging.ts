import * as messaging from "messaging";
import { CompanionRequest } from "../common/messaging";
import { Location } from "../common/sunevents";

export type LocationListener = (loc: Location) => void;

const listeners: { location: LocationListener[]} = {
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
        listeners.location.forEach(l => l({lat: pos.coords.latitude, lon: pos.coords.longitude}));
    }
});

export const requestLocation = (listener: LocationListener) => {
    // add to listeners if we don't have it yet
    // todo: unsubscribe
    if (listeners.location.indexOf(listener) < 0) {
        console.log("Adding listener");
        const size = listeners.location.push(listener);
        console.log("Listener count: " + size);
    }

    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        console.log("Connextion already open");
        sendMessage<"location", void>({request: "location"});
    } else {
        console.log("Open the connection");
        messaging.peerSocket.addEventListener("open", (evt) => {
            sendMessage<"location", void>({request: "location"});
        });
    }
}

