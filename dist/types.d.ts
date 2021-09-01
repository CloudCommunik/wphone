import { UserAgent } from "sip.js";
export interface WPhoneConfig {
    displayName?: string;
    domain: string;
    username: string;
    secret: string;
    audioElementId: string;
    extraHeaders?: Array<string>;
    expires?: number;
    server: string;
}
export interface CallRequest {
    targetAOR: string;
    extraHeaders?: Array<string>;
}
export interface MessageRequest {
}
export interface InviterConfig {
    userAgent: UserAgent;
    targetAOR: string;
    audioElement: HTMLAudioElement;
    extraHeaders?: Array<string>;
}
