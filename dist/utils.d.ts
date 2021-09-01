import { Inviter, UserAgentDelegate, UserAgentOptions, Web } from "sip.js";
import { WPhoneConfig, InviterConfig } from "./types";
export declare function createInviter(inviterParam: InviterConfig): {
    inviter: Inviter;
    sessionDescriptionHandler: Web.SessionDescriptionHandler;
};
export declare function createUserAgentOptions(config: WPhoneConfig, delegate: UserAgentDelegate): UserAgentOptions;
export declare function assignStream(stream: MediaStream, element: HTMLMediaElement): void;
export declare function getAudio(id: string): HTMLAudioElement;
export declare function getButton(id: string): HTMLButtonElement;
export declare function getInput(id: string): HTMLInputElement;
export declare function setInput(id: string, value: string): void;
export declare function getConfig(): WPhoneConfig;
