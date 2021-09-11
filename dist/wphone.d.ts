/// <reference types="node" />
import { CallRequest, MessageRequest, WPhoneConfig } from "./types";
import { Inviter, Registerer, SessionDescriptionHandler, UserAgent } from "sip.js";
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
    constructor(config: WPhoneConfig);
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
    call(request: CallRequest): Promise<void>;
    /**
     * Closes the session.
     */
    hangup(): void;
    /**
     * Connects to signaling server and optionally register too.
     *
     * @param {boolean} register - If set to `true` it will also register the endpoint
     */
    connect(register?: boolean): Promise<void>;
    /**
     * Reconnects to signaling server.
     */
    reconnect(): Promise<void>;
    /**
     * Closes connection to signaling server.
     */
    disconnect(): void;
    /**
     * Returns `true` if the wphone is connected to WS or WSS server.
     */
    isConnected(): boolean;
    /**
     * Sends a DTMF tones to another SIP endpoint.
     *
     * @param {string} tones - Tones to send
     */
    sendDtmf(tones: string): void;
    /**
     * Sends a SIP message to another SIP endpoint.
     *
     * @param {MessageRequest} request - Request to send SIP message
     */
    sendMessage(request: MessageRequest): void;
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
    on(eventName: string, callback: Function): void;
}
