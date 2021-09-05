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
 * @classdesc WPhone is a basic user agent you can use to build more
 * complex WebRTC solutions.
 *
 * @example
 * const WPhone = require("wphone");
 * phone = new WPhone({...});
 * await phone.connect();
 * phone.call({
 *   targetAOR: "sip:1001@sip.domain.net"
 * });
 */
export default class WPhone {
  audioElement: HTMLAudioElement;
  userAgent: UserAgent;
  events: Events;
  connected: boolean;
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
    this.connected = false;

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
   * await phone.connect();
   * phone.call({
   *   targetAOR: "sip:1001@sip.domain.net"
   * });
   */
  call(request: CallRequest) {
    const result = createInviter({
      userAgent: this.userAgent,
      audioElement: this.audioElement,
      extraHeaders: request.extraHeaders || this.config.extraHeaders,
      targetAOR: request.targetAOR
    });
    this.inviter = result.inviter;
    this.sessionDescriptionHandler = result.sessionDescriptionHandler;
    this.inviter.invite();
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
   * Clsoses connection to signaling server.
   */
  disconnect() {
    this.userAgent.stop();
  }

  /**
   * Returns true if the wphone is connected to WS or WSS server.
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
   * @param {MessageRequest} request - Request for SIP message
   */
  sendMessage(request: MessageRequest) {
    throw new Error("Method nyi");
  }

  /**
   * Fires user agents events.
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
