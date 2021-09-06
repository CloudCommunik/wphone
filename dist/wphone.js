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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        this.config = config;
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
            extraHeaders: request.extraHeaders || this.config.extraHeaders,
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
        if (register === void 0) { register = false; }
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userAgent.start()];
                    case 1:
                        _a.sent();
                        if (register) {
                            this.registerer.register();
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        this.events.emit("error", e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Reconnects to signaling server.
     */
    WPhone.prototype.reconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.userAgent.reconnect()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        this.events.emit("error", e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clsoses connection to signaling server.
     */
    WPhone.prototype.disconnect = function () {
        this.userAgent.stop();
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