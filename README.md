<a name="WPhone"></a>

## WPhone
WPhone is SIP user agent you can use to create web-based softphones.
It uses [SIP.js](https://sipjs.com) as the foundation but aims to be much easier for simple use-cases.

Create an HTMLAudioElement, in your HTML code, give it an id and use it to create your WPhone object.
See [src/examples.ts](src/examples.ts) for an implementation example.

> Thanks to the folks at [onsip.com](onsip.com) for such a fantastic job with SIP.js. 🔥

**Kind**: global class  

* [WPhone](#WPhone)
    * [new WPhone(config)](#new_WPhone_new)
    * [.call(request)](#WPhone+call)
    * [.hangup()](#WPhone+hangup)
    * [.connect(register)](#WPhone+connect)
    * [.reconnect()](#WPhone+reconnect)
    * [.disconnect()](#WPhone+disconnect)
    * [.isConnected()](#WPhone+isConnected)
    * [.sendDtmf(tones)](#WPhone+sendDtmf)
    * [.sendMessage(request)](#WPhone+sendMessage)
    * [.on(eventName, callback)](#WPhone+on)

<a name="new_WPhone_new"></a>

### new WPhone(config)
Constructs a new WPhone object.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>WPhoneConfig</code> | Configuration object for WPhone |
| config.displayName | <code>string</code> | Optional friendly name to send to the receiver endpoint |
| config.domain | <code>string</code> | Domain or host for the user agent account |
| config.username | <code>string</code> | Username for authentication |
| config.secret | <code>string</code> | Password for authentication |
| config.server | <code>string</code> | Signaling server |
| config.audioElementId | <code>string</code> | HTML element to connect the audio to |
| config.extraHeaders | <code>Array.&lt;string&gt;</code> | Optional headers |
| config.expires | <code>string</code> | Expiration for register requests |

**Example**  
```js
const WPhone = require("wphone");

const config = {
 displayName: "John Doe",
 domain: "sip.acme.com",
 username: "1001",
 secret: "changeit",
 audioElementId: "remoteAudio",
 secret: "ws://yoursignalingserver:5062",
 extraHeaders: ["X-Extra-Header: 'extra header'"]
}

wPhone = new WPhone(config);

await wPhone.connect();
await wPhone.call({
  targetAOR: "sip:1002@sip.acme.com",
  extraHeaders: ["X-Extra-Header: 'more extra headers'"]
});
```
<a name="WPhone+call"></a>

### wPhone.call(request)
Calls another SIP endpoint.

**Kind**: instance method of [<code>WPhone</code>](#WPhone)  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>CallRequest</code> | Request for SIP invite |
| request.targetAOR | <code>string</code> | Address of Record of receiving endpoint |
| request.extraHeaders | <code>Array.&lt;string&gt;</code> | Optional headers |

**Example**  
```js
await wPhone.connect();
await wPhone.call({
  targetAOR: "sip:1002@sip.acme.com"
});
```
<a name="WPhone+hangup"></a>

### wPhone.hangup()
Closes the session.

**Kind**: instance method of [<code>WPhone</code>](#WPhone)  
<a name="WPhone+connect"></a>

### wPhone.connect(register)
Connects to signaling server and optionally register too.

**Kind**: instance method of [<code>WPhone</code>](#WPhone)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| register | <code>boolean</code> | <code>false</code> | If set to `true` it will also register the endpoint |

<a name="WPhone+reconnect"></a>

### wPhone.reconnect()
Reconnects to signaling server.

**Kind**: instance method of [<code>WPhone</code>](#WPhone)  
<a name="WPhone+disconnect"></a>

### wPhone.disconnect()
Closes connection to signaling server.

**Kind**: instance method of [<code>WPhone</code>](#WPhone)  
<a name="WPhone+isConnected"></a>

### wPhone.isConnected()
Returns `true` if the wphone is connected to WS or WSS server.

**Kind**: instance method of [<code>WPhone</code>](#WPhone)  
<a name="WPhone+sendDtmf"></a>

### wPhone.sendDtmf(tones)
Sends a DTMF tones to another SIP endpoint.

**Kind**: instance method of [<code>WPhone</code>](#WPhone)  

| Param | Type | Description |
| --- | --- | --- |
| tones | <code>string</code> | Tones to send |

<a name="WPhone+sendMessage"></a>

### wPhone.sendMessage(request)
Sends a SIP message to another SIP endpoint.

**Kind**: instance method of [<code>WPhone</code>](#WPhone)  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>MessageRequest</code> | Request to send SIP message |

<a name="WPhone+on"></a>

### wPhone.on(eventName, callback)
Fires user agent's events.

**Kind**: instance method of [<code>WPhone</code>](#WPhone)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | Name of the event fired |
| callback | <code>function</code> | Callback with the event's payload Events:  - invite  - message  - hangup  - error  - disconnect |

