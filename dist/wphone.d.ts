/// <reference types="node" />
import { CallRequest, MessageRequest, WPhoneConfig } from "./types";
import { Inviter, Registerer, SessionDescriptionHandler, UserAgent } from "sip.js";
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
    constructor(config: WPhoneConfig);
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
    call(request: CallRequest): void;
    /**
     * Closes the session.
     */
    hangup(): void;
    /**
     * Connects to signaling server and optionally register too.
     */
    connect(register?: boolean): Promise<void>;
    /**
     * Reconnects to signaling server.
     */
    reconnect(): Promise<void>;
    /**
     * Clsoses connection to signaling server.
     */
    disconnect(): void;
    /**
     * Returns true if the wphone is connected to WS or WSS server.
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
     * @param {MessageRequest} request - Request for SIP message
     */
    sendMessage(request: MessageRequest): void;
    /**
     * Fires user agents events.
     * Events:
     *  - invite
     *  - message
     *  - hangup
     *  - error
     *  - disconnect
     */
    on(eventName: string, callback: Function): void;
}
