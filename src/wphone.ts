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
  CallRequest,
  MessageRequest,
  WPhoneConfig
} from "./types";
import {
  Invitation,
  Inviter,
  Message,
  Registerer,
  RegistererOptions,
  SessionDescriptionHandler,
  URI,
  UserAgent,
  UserAgentDelegate
} from "sip.js";
import {
  createUserAgentOptions,
  createInviter,
  getAudio
} from "./utils.js";
import Events from "events";

/**
 * @classdesc WPhone is SIP user agent you can use to create web-based softphones.
 * It uses [SIP.js](https://sipjs.com) as the foundation but aims to be much easier for simple use-cases.
 * 
 * Create an HTMLAudioElement, in your HTML code, give it an id and use it to create your WPhone object.
 * See [src/examples.ts](src/examples.ts) for an implementation example.
 * 
 * > Thanks to the folks at [onsip.com](onsip.com) for such a fantastic job with SIP.js. 🔥
 * 
 * @example
 * const WPhone = require("wphone");
 * 
 * const config = {
 *  displayName: "John Doe",
 *  domain: "sip.acme.com",
 *  username: "1001",
 *  secret: "changeit",
 *  audioElementId: "remoteAudio",
 *  secret: "ws://yoursignalingserver:5062",
 *  extraHeaders: ["X-Extra-Header: 'extra header'"]
 * }
 * 
 * wPhone = new WPhone(config);
 * 
 * await wPhone.connect();
 * await wPhone.call({
 *   targetAOR: "sip:1002@sip.acme.com",
 *   extraHeaders: ["X-Extra-Header: 'more extra headers'"]
 * });
 */
export default class WPhone {
  audioElement: HTMLAudioElement;
  userAgent: UserAgent;
  events: Events;
  registerer: Registerer;
  inviter: Inviter;
  sessionDescriptionHandler: SessionDescriptionHandler;
  config: WPhoneConfig;
  /**
   * Constructs a new WPhone object.
   *
   * @param {WPhoneConfig} config - Configuration object for WPhone
   * @param {string} config.displayName - Optional friendly name to send to the receiver endpoint
   * @param {string} config.domain - Domain or host for the user agent account
   * @param {string} config.username - Username for authentication
   * @param {string} config.secret - Password for authentication
   * @param {string} config.server - Signaling server
   * @param {string} config.audioElementId - HTML element to connect the audio to
   * @param {Array<string>} config.extraHeaders - Optional headers
   * @param {string} config.expires - Expiration for register requests
   */
  constructor(config: WPhoneConfig) {
    this.config = config;
    this.audioElement = getAudio(config.audioElementId);
    this.events = new Events();

    const delegate: UserAgentDelegate = {
      onDisconnect: (error: Error): void => {
        if (error) {
          this.events.emit("disconnect", error);
        }
      },
      onInvite: (invitation: Invitation) => {
        this.events.emit("invite", invitation);
      },
      onMessage: (message: Message) => {
        this.events.emit("message", message);
      }
    };

    // Sets up the user agent options
    const userAgentOptions = createUserAgentOptions(config, delegate);
    // Creates SIP client that will connect to VoIP backend
    this.userAgent = new UserAgent(userAgentOptions);

    const registererOptions: RegistererOptions = {
      expires: config.expires || 600,
      registrar: new URI("sip", config.username, config.server)
    };
    this.registerer = new Registerer(this.userAgent, registererOptions);
  }

  /**
   * Calls another SIP endpoint.
   *
   * @param {CallRequest} request - Request for SIP invite
   * @param {string} request.targetAOR - Address of Record of receiving endpoint
   * @param {Array<string>} request.extraHeaders - Optional headers
   * @example
   *
   * await wPhone.connect();
   * await wPhone.call({
   *   targetAOR: "sip:1002@sip.acme.com"
   * });
   */
  async call(request: CallRequest) {
    const inviter = createInviter({
      userAgent: this.userAgent,
      audioElement: this.audioElement,
      extraHeaders: request.extraHeaders || this.config.extraHeaders,
      targetAOR: request.targetAOR
    });
    this.inviter = inviter
    await this.inviter.invite();
    this.sessionDescriptionHandler = this.inviter.sessionDescriptionHandler;
  }

  /**
   * Closes the session.
   */
  hangup() {
    if (this.inviter) {
      this.inviter.bye();
      this.inviter.dispose();
    }
  }

  /**
   * Connects to signaling server and optionally register too. 
   * 
   * @param {boolean} register - If set to `true` it will also register the endpoint
   */
  async connect(register = false) {
    try {
      await this.userAgent.start()
      if (register) {
        this.registerer.register();
      }
    } catch (e) {
      this.events.emit("error", e);
    }
  }

  /**
   * Reconnects to signaling server.
   */
  async reconnect() {
    try {
      await this.userAgent.reconnect();
    } catch (e) {
      this.events.emit("error", e);
    }
  }

  /**
   * Closes connection to signaling server.
   */
  disconnect() {
    this.userAgent.stop();
  }

  /**
   * Returns `true` if the wphone is connected to WS or WSS server.
   */
  isConnected() {
    return this.userAgent.isConnected();
  }

  /** 
   * Sends a DTMF tones to another SIP endpoint.
   *
   * @param {string} tones - Tones to send
   */
  sendDtmf(tones: string) {
    this.sessionDescriptionHandler.sendDtmf(tones);
  }

  /** 
   * Sends a SIP message to another SIP endpoint.
   *
   * @param {MessageRequest} request - Request to send SIP message
   */
  sendMessage(request: MessageRequest) {
    throw new Error("Method nyi");
  }

  /**
   * Fires user agent's events.
   * 
   * @param {string} eventName - Name of the event fired
   * @param {Function} callback - Callback with the event's payload
   * 
   * Events:
   *  - invite
   *  - message
   *  - hangup
   *  - error
   *  - disconnect
   */
  on(eventName: string, callback: Function) {
    this.events.on(eventName, (data: unknown) => {
      callback(data);
    });
  }
}
