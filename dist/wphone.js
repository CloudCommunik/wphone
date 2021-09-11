"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sip_js_1 = require("sip.js");
const utils_js_1 = require("./utils.js");
const events_1 = __importDefault(require("events"));
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
class WPhone {
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
    constructor(config) {
        this.config = config;
        this.audioElement = (0, utils_js_1.getAudio)(config.audioElementId);
        this.events = new events_1.default();
        this.connected = false;
        const delegate = {
            onDisconnect: (error) => {
                if (error) {
                    this.events.emit("disconnect", error);
                }
            },
            onInvite: (invitation) => {
                this.events.emit("invite", invitation);
            },
            onMessage: (message) => {
                this.events.emit("message", message);
            }
        };
        // Sets up the user agent options
        const userAgentOptions = (0, utils_js_1.createUserAgentOptions)(config, delegate);
        // Creates SIP client that will connect to VoIP backend
        this.userAgent = new sip_js_1.UserAgent(userAgentOptions);
        const registererOptions = {
            expires: config.expires || 600,
            registrar: new sip_js_1.URI("sip", config.username, config.server)
        };
        this.registerer = new sip_js_1.Registerer(this.userAgent, registererOptions);
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
    call(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const inviter = (0, utils_js_1.createInviter)({
                userAgent: this.userAgent,
                audioElement: this.audioElement,
                extraHeaders: request.extraHeaders || this.config.extraHeaders,
                targetAOR: request.targetAOR
            });
            this.inviter = inviter;
            yield this.inviter.invite();
            this.sessionDescriptionHandler = this.inviter.sessionDescriptionHandler;
        });
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
    connect(register = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userAgent.start();
                if (register) {
                    this.registerer.register();
                }
            }
            catch (e) {
                this.events.emit("error", e);
            }
        });
    }
    /**
     * Reconnects to signaling server.
     */
    reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userAgent.reconnect();
            }
            catch (e) {
                this.events.emit("error", e);
            }
        });
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
    sendDtmf(tones) {
        this.sessionDescriptionHandler.sendDtmf(tones);
    }
    /**
     * Sends a SIP message to another SIP endpoint.
     *
     * @param {MessageRequest} request - Request for SIP message
     */
    sendMessage(request) {
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
    on(eventName, callback) {
        this.events.on(eventName, (data) => {
            callback(data);
        });
    }
}
exports.default = WPhone;
//# sourceMappingURL=wphone.js.map