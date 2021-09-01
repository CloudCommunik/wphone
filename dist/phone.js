"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sip_js_1 = require("sip.js");
var utils_js_1 = require("./utils.js");
var events_1 = __importDefault(require("events"));
var Phone = /** @class */ (function () {
    function Phone(config) {
        var _this = this;
        this.audioElement = (0, utils_js_1.getAudio)(config.audioElementId);
        this.events = new events_1.default();
        this.connected = false;
        var delegate = {
            onDisconnect: function (error) {
                if (error) {
                    _this.events.emit("error", error);
                }
            },
            onInvite: function (invitation) {
                _this.events.emit("invite", invitation);
            },
            onMessage: function (message) {
                _this.events.emit("message", message);
            },
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
    Phone.prototype.call = function (request) {
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
    Phone.prototype.hangup = function () {
        if (this.inviter) {
            this.inviter.bye();
            this.inviter.dispose();
        }
    };
    Phone.prototype.connect = function (register) {
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
    Phone.prototype.reconnect = function () {
        var _this = this;
        this.userAgent.reconnect()
            .then(function () { })
            .catch(function (e) {
            _this.events.emit("error", e);
        });
    };
    Phone.prototype.disconnect = function () {
        this.userAgent.stop();
        this.registerer.unregister();
    };
    Phone.prototype.isConnected = function () {
        return this.userAgent.isConnected();
    };
    Phone.prototype.sendDtmf = function (tones) {
        this.sessionDescriptionHandler.sendDtmf(tones);
    };
    Phone.prototype.sendMessage = function (request) {
        throw new Error("Method nyi");
    };
    // invite
    // message
    // hangup
    // error
    // disconnect
    Phone.prototype.on = function (eventName, callback) {
        this.events.on(eventName, function (data) {
            callback(data);
        });
    };
    return Phone;
}());
exports.default = Phone;
//# sourceMappingURL=phone.js.map