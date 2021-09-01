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
import {
  getButton,
  getConfig,
  getInput,
  setInput
} from "./utils";
import WPhone from "./wphone";
export const connectButton = getButton("connect");
export const disconnectButton = getButton("disconnect");

// Obtaining config from localStorage if available
window.onload = async () => {
  console.debug("Getting config from localStorage [fonosphone]");
  const configString = window.localStorage.getItem("fonosphone");

  if (configString) {
    const config = JSON.parse(configString);
    setInput("displayName", config.displayName);
    setInput("username", config.username);
    setInput("domain", config.domain);
    setInput("secret", config.secret);
    setInput("server", config.server);
    setInput("targetAOR", config.targetAOR);
    setInput("extraHeaders", config.extraHeaders);
  } else {
    console.debug("The phone config is empty");
  }
};

let phone = null;

connectButton.addEventListener("click", async () => {
  try {
    const config: any = getConfig();
    phone = new WPhone(config);

    await phone.connect();
    phone.call({
      targetAOR: getInput("targetAOR").value,
      extraHeaders: config.extraHeaders
    });

    config.targetAOR = getInput("targetAOR").value;
    if (config.extraHeaders) {
      config.extraHeaders = config.extraHeaders.join(",")
    }
    window.localStorage.setItem("fonosphone", JSON.stringify(config));
  } catch (e) {
    window.alert(e);
  }
});

disconnectButton.addEventListener("click", () => {
  if (phone) phone.disconnect();
});