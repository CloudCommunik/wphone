/// <reference types="node" />
import { CallRequest, FonosPhoneConfig, MessageRequest } from "./types";
import { Registerer, SessionDescriptionHandler, UserAgent } from "sip.js";
import Events from "events";
export default class Phone {
    audioElement: HTMLAudioElement;
    userAgent: UserAgent;
    events: Events;
    connected: boolean;
    registerer: Registerer;
    inviter: any;
    sessionDescriptionHandler: SessionDescriptionHandler;
    constructor(config: FonosPhoneConfig);
    call(request: CallRequest): void;
    hangup(): void;
    connect(register?: boolean): void;
    reconnect(): void;
    disconnect(): void;
    isConnected(): boolean;
    sendDtmf(tones: string): void;
    sendMessage(request: MessageRequest): void;
    on(eventName: string, callback: Function): void;
}
