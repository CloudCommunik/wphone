"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sip_js_1 = require("sip.js");
var utils_js_1 = require("./utils.js");
var events_1 = __importDefault(require("events"));
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
var WPhone = /** @class */ (function () {
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
    function WPhone(config) {
        var _this = this;
        this.audioElement = (0, utils_js_1.getAudio)(config.audioElementId);
        this.events = new events_1.default();
        this.connected = false;
        var delegate = {
            onDisconnect: function (error) {
                if (error) {
                    _this.events.emit("disconnect", error);
                }
            },
            onInvite: function (invitation) {
                _this.events.emit("invite", invitation);
            },
            onMessage: function (message) {
                _this.events.emit("message", message);
            }
        };
        // Sets up the user agent options
        var userAgentOptions = (0, utils_js_1.createUserAgentOptions)(config, delegate);
        // Creates SIP client that will connect to VoIP backend
        this.userAgent = new sip_js_1.UserAgent(userAgentOptions);
        var registererOptions = {
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
    WPhone.prototype.call = function (request) {
        var result = (0, utils_js_1.createInviter)({
            userAgent: this.userAgent,
            audioElement: this.audioElement,
            extraHeaders: request.extraHeaders,
            targetAOR: request.targetAOR
        });
        this.inviter = result.inviter;
        this.sessionDescriptionHandler = result.sessionDescriptionHandler;
        this.inviter.invite();
    };
    /**
     * Closes the session.
     */
    WPhone.prototype.hangup = function () {
        if (this.inviter) {
            this.inviter.bye();
            this.inviter.dispose();
        }
    };
    /**
     * Connects to signaling server and optionally register too.
     */
    WPhone.prototype.connect = function (register) {
        var _this = this;
        if (register === void 0) { register = false; }
        this.userAgent.start()
            .then(function () {
            // Also register
            if (register) {
                _this.registerer.register();
            }
        })
            .catch(function (e) {
            _this.events.emit("error", e);
        });
    };
    /**
     * Reconnects to signaling server.
     */
    WPhone.prototype.reconnect = function () {
        var _this = this;
        this.userAgent.reconnect()
            .then(function () { })
            .catch(function (e) {
            _this.events.emit("error", e);
        });
    };
    /**
     * Clsoses connection to signaling server.
     */
    WPhone.prototype.disconnect = function () {
        this.userAgent.stop();
        this.registerer.unregister();
    };
    /**
     * Returns true if the wphone is connected to WS or WSS server.
     */
    WPhone.prototype.isConnected = function () {
        return this.userAgent.isConnected();
    };
    /**
     * Sends a DTMF tones to another SIP endpoint.
     *
     * @param {string} tones - Tones to send
     */
    WPhone.prototype.sendDtmf = function (tones) {
        this.sessionDescriptionHandler.sendDtmf(tones);
    };
    /**
     * Sends a SIP message to another SIP endpoint.
     *
     * @param {MessageRequest} request - Request for SIP message
     */
    WPhone.prototype.sendMessage = function (request) {
        throw new Error("Method nyi");
    };
    /**
     * Fires user agents events.
     * Events:
     *  - invite
     *  - message
     *  - hangup
     *  - error
     *  - disconnect
     */
    WPhone.prototype.on = function (eventName, callback) {
        this.events.on(eventName, function (data) {
            callback(data);
        });
    };
    return WPhone;
}());
exports.default = WPhone;
//# sourceMappingURL=wphone.js.map