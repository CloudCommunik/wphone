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
import { 
    Inviter,
    SessionState,
    UserAgent,
    UserAgentDelegate,
    UserAgentOptions, 
    Web
} from "sip.js";
import { WPhoneConfig, InviterConfig } from "./types";

export function createInviter(inviterParam: InviterConfig) {
  const target = UserAgent.makeURI(inviterParam.targetAOR);
  const inviter = new Inviter(inviterParam.userAgent, target, {
    extraHeaders: inviterParam.extraHeaders,
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: true,
        video: false
      }
    }
  });

  inviter.stateChange.addListener((state: SessionState) => {
    console.log(`Session state changed to ${state}`);

    switch (state) {
      case SessionState.Initial:
        break;
      case SessionState.Establishing:
        break;
      case SessionState.Established:
        const sessionDescriptionHandler = inviter.sessionDescriptionHandler as Web.SessionDescriptionHandler;
        assignStream(sessionDescriptionHandler.remoteMediaStream, inviterParam.audioElement);
        sessionDescriptionHandler.peerConnectionDelegate = {
          // NOTE:: SB - Allowing to get onTrack events to know when a new track added to the peer connection.
          // When we get a new track event, we'll assign the last new remote media stream to HTML audio element source.
          // Mostly will occur when RE-INVITEs will happen.
          ontrack(event: Event) {
            assignStream(sessionDescriptionHandler.remoteMediaStream, inviterParam.audioElement);
          }
        }
        break;
      case SessionState.Terminating:
      // fall through
      case SessionState.Terminated:
        // cleanupMedia();
        console.log("");
        break;
      default:
        throw new Error("Unknown session state.");
    }
  });

  return inviter;
}

export function createUserAgentOptions(config: WPhoneConfig,
  delegate: UserAgentDelegate): UserAgentOptions {
  return {
    uri: UserAgent.makeURI(`sip:${config.username}@${config.domain}`),
    delegate,
    displayName: config.displayName,
    authorizationUsername: config.username,
    authorizationPassword: config.secret,
    transportOptions: {
      server: config.server
    }
  };
}

// Assign a MediaStream to an HTMLMediaElement and update if tracks change.
export function assignStream(stream: MediaStream, element: HTMLMediaElement): void {
  // Set element source.
  element.autoplay = true; // Safari does not allow calling .play() from a non user action
  element.srcObject = stream;

  // Load and start playback of media.
  element.play().catch((error: Error) => {
    console.error("Failed to play media");
    console.error(error);
  });

  // If a track is added, load and restart playback of media.
  stream.onaddtrack = (): void => {
    element.load(); // Safari does not work otheriwse
    element.play().catch((error: Error) => {
      console.error("Failed to play remote media on add track");
      console.error(error);
    });
  };

  // If a track is removed, load and restart playback of media.
  stream.onremovetrack = (): void => {
    element.load(); // Safari does not work otheriwse
    element.play().catch((error: Error) => {
      console.error("Failed to play remote media on remove track");
      console.error(error);
    });
  };
}

export function getAudio(id: string): HTMLAudioElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLAudioElement)) {
    throw new Error(`Element "${id}" not found or not an audio element.`);
  }
  return el;
}

export function getButton(id: string): HTMLButtonElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLButtonElement)) {
    throw new Error(`Element "${id}" not found or not a button element.`);
  }
  return el;
}

export function getInput(id: string): HTMLInputElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLInputElement)) {
    throw new Error(`Element "${id}" not found or not an input element.`);
  }
  return el;
}

export function setInput(id: string, value: string): void {
  const input = getInput(id);
  input.value = value ? value : "";
}

export function getConfig(): WPhoneConfig {
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
