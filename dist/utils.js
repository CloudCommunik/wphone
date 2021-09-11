"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.setInput = exports.getInput = exports.getButton = exports.getAudio = exports.assignStream = exports.createUserAgentOptions = exports.createInviter = void 0;
/*
 * Copyright (C) 2021 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/wphone
 *
 * This file is part of WPHONE
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const sip_js_1 = require("sip.js");
function createInviter(inviterParam) {
    const target = sip_js_1.UserAgent.makeURI(inviterParam.targetAOR);
    const inviter = new sip_js_1.Inviter(inviterParam.userAgent, target, {
        extraHeaders: inviterParam.extraHeaders,
        sessionDescriptionHandlerOptions: {
            constraints: {
                audio: true,
                video: false
            }
        }
    });
    inviter.stateChange.addListener((state) => {
        console.log(`Session state changed to ${state}`);
        switch (state) {
            case sip_js_1.SessionState.Initial:
                break;
            case sip_js_1.SessionState.Establishing:
                break;
            case sip_js_1.SessionState.Established:
                const sessionDescriptionHandler = inviter.sessionDescriptionHandler;
                assignStream(sessionDescriptionHandler.remoteMediaStream, inviterParam.audioElement);
                sessionDescriptionHandler.peerConnectionDelegate = {
                    // NOTE:: SB - Allowing to get onTrack events to know when a new track added to the peer connection.
                    // When we get a new track event, we'll assign the last new remote media stream to HTML audio element source.
                    // Mostly will occur when RE-INVITEs will happen.
                    ontrack(event) {
                        assignStream(sessionDescriptionHandler.remoteMediaStream, inviterParam.audioElement);
                    }
                };
                break;
            case sip_js_1.SessionState.Terminating:
            // fall through
            case sip_js_1.SessionState.Terminated:
                // cleanupMedia();
                console.log("");
                break;
            default:
                throw new Error("Unknown session state.");
        }
    });
    return inviter;
}
exports.createInviter = createInviter;
function createUserAgentOptions(config, delegate) {
    return {
        uri: sip_js_1.UserAgent.makeURI(`sip:${config.username}@${config.domain}`),
        delegate,
        displayName: config.displayName,
        authorizationUsername: config.username,
        authorizationPassword: config.secret,
        transportOptions: {
            server: config.server
        }
    };
}
exports.createUserAgentOptions = createUserAgentOptions;
// Assign a MediaStream to an HTMLMediaElement and update if tracks change.
function assignStream(stream, element) {
    // Set element source.
    element.autoplay = true; // Safari does not allow calling .play() from a non user action
    element.srcObject = stream;
    // Load and start playback of media.
    element.play().catch((error) => {
        console.error("Failed to play media");
        console.error(error);
    });
    // If a track is added, load and restart playback of media.
    stream.onaddtrack = () => {
        element.load(); // Safari does not work otheriwse
        element.play().catch((error) => {
            console.error("Failed to play remote media on add track");
            console.error(error);
        });
    };
    // If a track is removed, load and restart playback of media.
    stream.onremovetrack = () => {
        element.load(); // Safari does not work otheriwse
        element.play().catch((error) => {
            console.error("Failed to play remote media on remove track");
            console.error(error);
        });
    };
}
exports.assignStream = assignStream;
function getAudio(id) {
    const el = document.getElementById(id);
    if (!(el instanceof HTMLAudioElement)) {
        throw new Error(`Element "${id}" not found or not an audio element.`);
    }
    return el;
}
exports.getAudio = getAudio;
function getButton(id) {
    const el = document.getElementById(id);
    if (!(el instanceof HTMLButtonElement)) {
        throw new Error(`Element "${id}" not found or not a button element.`);
    }
    return el;
}
exports.getButton = getButton;
function getInput(id) {
    const el = document.getElementById(id);
    if (!(el instanceof HTMLInputElement)) {
        throw new Error(`Element "${id}" not found or not an input element.`);
    }
    return el;
}
exports.getInput = getInput;
function setInput(id, value) {
    const input = getInput(id);
    input.value = value ? value : "";
}
exports.setInput = setInput;
function getConfig() {
    const extraHeaders = getInput("extraHeaders").value
        ? getInput("extraHeaders").value.split(",")
        : null;
    return {
        displayName: getInput("displayName").value,
        username: getInput("username").value,
        secret: getInput("secret").value,
        domain: getInput("domain").value,
        server: getInput("server").value,
        extraHeaders,
        audioElementId: "remoteAudio",
    };
}
exports.getConfig = getConfig;
//# sourceMappingURL=utils.js.map