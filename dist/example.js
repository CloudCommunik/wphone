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
const utils_1 = require("./utils");
const wphone_1 = __importDefault(require("./wphone"));
exports.connectButton = (0, utils_1.getButton)("connect");
exports.disconnectButton = (0, utils_1.getButton)("disconnect");
// Obtaining config from localStorage if available
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    console.debug("Getting config from localStorage [fonosphone]");
    const configString = window.localStorage.getItem("fonosphone");
    if (configString) {
        const config = JSON.parse(configString);
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
});
let phone = null;
exports.connectButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = (0, utils_1.getConfig)();
        phone = new wphone_1.default(config);
        yield phone.connect();
        phone.call({
            targetAOR: (0, utils_1.getInput)("targetAOR").value,
            extraHeaders: config.extraHeaders
        });
        config.targetAOR = (0, utils_1.getInput)("targetAOR").value;
        if (config.extraHeaders) {
            config.extraHeaders = config.extraHeaders.join(",");
        }
        window.localStorage.setItem("fonosphone", JSON.stringify(config));
    }
    catch (e) {
        window.alert(e);
    }
}));
exports.disconnectButton.addEventListener("click", () => {
    if (phone)
        phone.disconnect();
});
//# sourceMappingURL=example.js.map