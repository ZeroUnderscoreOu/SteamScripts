// ==UserScript==
// @name        Steam Queue Spinner
// @author      ZeroUnderscoreOu
// @version     1.3.4
// @icon        
// @description Spinner for your Steam Discovery Queue
// @namespace   https://github.com/ZeroUnderscoreOu/
// @match       *://store.steampowered.com/explore*
// @run-at      document-idle
// @grant       none
// ==/UserScript==

/*
Почему относительные протокола адреса ("//") нормально работают в консоли, но выдают ошибку в GM? Пришлось жёстко вписать протокол (с учётом введённой поддержки HTTPS Стимом).
Переписать стиль спэна на инлайн?
*/

"use strict";

var IntervalId;
var Queues = document.querySelector("Div.discover_queue_empty Div.subtext"); // amount of queues to clear; attempting to get amount of cards
var Style = document.createElement("Style");
var Button = document.createElement("Div");
var Div = document.querySelector("Div.discovery_queue_customize_ctn");
var RGAD = [];

// unsafeWindow variables; don't know any better way to read page variables
var GSID;
var GSession;

try { // only Greasemonkey supports this, I think
	GSID = unsafeWindow.GStoreItemData;
	GSession = unsafeWindow.g_sessionID;
} catch (Data) { // other managers should be able to access page variables normally, I think
	console.error("SQS - unsafeWindow not supported?",Data);
	GSID = GStoreItemData;
	GSession = g_sessionID;
};

try {
	Queues = parseInt(Queues.textContent.match(/-?\d/)[0],10);
} catch (Data) {
	console.log("SQS - defaulting queues to 1:",Data);
	Queues = 1; // defaulting to 1 as it seems to be the standard now
};
/*
if (Queues<1) { // potential fix for Steam error
	Queues = 3;
};
*/

console.log("SQS - queues expected:",Queues);
Style.textContent = "#QueueButton {Min-Width: 100px; Text-Align: Center;}";
Button.id = "QueueButton";
Button.className = "btnv6_blue_hoverfade btn_medium";

try {
	RGAD = Object.keys(GSID.rgAppData);
} catch (Data) {
	console.error("SQS - couldn't read rgAppData:",Data);
};

if (RGAD.length==0) { // if page queue is empty
	Button.addEventListener("click",QueueGenerate);
} else {
	Button.addEventListener("click",QueueGet);
};

Button = Button.appendChild(document.createElement("Span"))
Button.textContent = "Spin";
document.head.appendChild(Style);
Div.insertBefore(Button.parentElement,Div.firstElementChild);

function QueueGet(Event,Queue) { // intentionally not providing default value for Queue
	// there is a problem with queue when there are unavailable apps in it:
	// Store itself manages it fine now, but spinning fails;
	// queue should contain full list, but IDK how to get it from page itself,
	// so I use rgAppData as a fallback
	var Ids = Queue || RGAD;
	Button.textContent = `Spin (${Queues*12})`; // for visibility with empty queues
	console.log("SQS -",Queues,Ids.join(", "));
	Queues--;
	IntervalId = setInterval(QueueClear,1000,Ids);
};

function QueueGenerate() {
	var Address = "https://store.steampowered.com/explore/generatenewdiscoveryqueue";
	var Data = new FormData();
	var Init = {
		method: "Post",
		body: Data,
		credentials: "same-origin"
	};
	Data.set("sessionid",GSession);
	Data.set("queuetype",0);
	fetch(Address,Init)
	.then((Data)=>(Data.json()))
	.then((Data)=>{
		if (Data.rgAppData==undefined) { // IDK why it's happening; need testing
			console.log("SQS - bad response:",Data.rgAppData,Data.queue,"\r\n",Data);
			Data.rgAppData = {};
		};
		RGAD = Object.keys(Data.rgAppData); // writing for fallback
		console.log("SQS - queue generated");
		QueueGet(null,Data.queue);
	})
	.catch((Data)=>{
		console.error("SQS - QueueGenerate():",Data);
	});
};

function QueueClear(Ids) {
	var Id = Ids.shift();
	if (!Id) {
		clearInterval(IntervalId);
		if (Queues>0) {
			QueueGenerate();
		} else {
			Button.textContent = "Spin (0)"; // for visibility with empty queues
			console.log("SQS - queues cleared");
		};
		return;
	};
	var Address = "https://store.steampowered.com/app/" + Id;
	var Data = new FormData();
	var Init = {
		method: "Post",
		body: Data,
		credentials: "same-origin"
	};
	Data.set("sessionid",GSession);
	Data.set("appid_to_clear_from_queue",Id);
	fetch(Address,Init).catch((Data)=>{
		console.error("SQS - QueueClear():",Data);
	});
	Button.textContent = `Spin (${Queues*12+Ids.length})`;
};
