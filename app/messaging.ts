import * as messaging from "messaging";
import { inbox } from "file-transfer";
import { CompanionRequest, CompanionResponse } from "../common/types";

const TIMEOUT = 60 * 1000; // wait max a minute for a response

export type Callback = (err: any, data: CompanionResponse) => void;
type QueueItem = {
    msg: CompanionRequest;
    cb: Callback;
}
const messageQueue: QueueItem[] = [];
const settingsListeners: Callback[] = [];

let waitingResponse = false;
let timer = undefined;

function sendMessage() {
    console.log("Message queue size: " + messageQueue.length);
    if (waitingResponse || messageQueue.length === 0) {
        return;
    }
    console.log("Sending...");
    waitingResponse = true;
    const msg = messageQueue[0];
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send(msg.msg);
    }

    timer = setTimeout(() => {
        console.log("Timeout");
        handleResponse("Timeout while waiting for the response", null);
    }, TIMEOUT);
}

function handleResponse(err: any, data: any): void {
    if (timer) {
        clearTimeout(timer);
        timer = undefined;
    }
    const item = messageQueue.shift();
    if (item?.cb) {
        item.cb(err, data);
    }
    waitingResponse = false;
    setTimeout(sendMessage, 0);
}

function handleSetting(data: CompanionResponse) {
    settingsListeners.forEach(cb => cb(null, data));
}

messaging.peerSocket.addEventListener("message", (evt) => {
    console.log("Got a message from the companion: " + JSON.stringify(evt.data));
    if (evt.data && evt.data.response === "setting") {
        return handleSetting(evt.data);
    }
    handleResponse(null, evt.data);
});

messaging.peerSocket.addEventListener("error", (err) => {
    console.log("Conn error: " + JSON.stringify(err));
    handleResponse(err, null);
});

inbox.onnewfile = () => {
    console.log("Got a new file transfer");
    let fileName: string;
    do {
        fileName = inbox.nextFile();
        if (fileName) {
            console.log("New bg image saved: " + fileName);
            handleSetting({
                response: "setting",
                data: {ownImage: fileName}
            })
      }
    } while (fileName);
};

export function send(msg: CompanionRequest, cb: Callback): void {
    const size = messageQueue.unshift({msg, cb});
    if (messaging.peerSocket.readyState !== messaging.peerSocket.OPEN) {
        console.log("Open the connection");
        messaging.peerSocket.addEventListener("open", (evt) => {
            sendMessage();
        });
    } else {
        sendMessage();
    }
}

export function listenSettings(cb: Callback) {
    settingsListeners.push(cb);
}
