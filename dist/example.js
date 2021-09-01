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
exports.disconnectButton = exports.connectButton = void 0;
/*
 * Copyright (C) 2021 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/wphone
 *
 * This file is part of WPhone
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
var utils_1 = require("./utils");
var wphone_1 = __importDefault(require("./wphone"));
exports.connectButton = (0, utils_1.getButton)("connect");
exports.disconnectButton = (0, utils_1.getButton)("disconnect");
// Obtaining config from localStorage if available
window.onload = function () { return __awaiter(void 0, void 0, void 0, function () {
    var configString, config;
    return __generator(this, function (_a) {
        console.debug("Getting config from localStorage [fonosphone]");
        configString = window.localStorage.getItem("fonosphone");
        if (configString) {
            config = JSON.parse(configString);
            (0, utils_1.setInput)("displayName", config.displayName);
            (0, utils_1.setInput)("username", config.username);
            (0, utils_1.setInput)("domain", config.domain);
            (0, utils_1.setInput)("secret", config.secret);
            (0, utils_1.setInput)("server", config.server);
            (0, utils_1.setInput)("targetAOR", config.targetAOR);
            (0, utils_1.setInput)("extraHeaders", config.extraHeaders);
        }
        else {
            console.debug("The phone config is empty");
        }
        return [2 /*return*/];
    });
}); };
var phone = null;
exports.connectButton.addEventListener("click", function () { return __awaiter(void 0, void 0, void 0, function () {
    var config, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                config = (0, utils_1.getConfig)();
                phone = new wphone_1.default(config);
                return [4 /*yield*/, phone.connect()];
            case 1:
                _a.sent();
                phone.call({
                    targetAOR: (0, utils_1.getInput)("targetAOR").value,
                    extraHeaders: config.extraHeaders
                });
                config.targetAOR = (0, utils_1.getInput)("targetAOR").value;
                if (config.extraHeaders) {
                    config.extraHeaders = config.extraHeaders.join(",");
                }
                window.localStorage.setItem("fonosphone", JSON.stringify(config));
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                window.alert(e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.disconnectButton.addEventListener("click", function () {
    if (phone)
        phone.disconnect();
});
//# sourceMappingURL=example.js.map