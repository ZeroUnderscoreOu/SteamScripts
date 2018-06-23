// ==UserScript==
// @name        Steam Queue Spinner
// @author      ZeroUnderscoreOu
// @version     1.3.1
// @icon        
// @description Spinner for your Steam Discovery Queue
// @namespace   https://github.com/ZeroUnderscoreOu/
// @match       *://store.steampowered.com/explore*
// @grant       none
// ==/UserScript==

/*
Почему относительные протокола адреса ("//") нормально работают в консоли, но выдают ошибку в GM? Пришлось жёстко вписать протокол (с учётом введённой поддержки HTTPS Стимом).
Переписать стиль спэна на инлайн?
*/

"use strict";
var IntervalId;
var Queues = document.querySelector("Div.discover_queue_empty Div.subtext").textContent.match(/-?\d/); // amount of queues to clear; attempting to get amount of cards
var Style = document.createElement("Style");
var Button = document.createElement("Div");
var Div = document.querySelector("Div.discovery_queue_customize_ctn");
Queues = Queues ? parseInt(Queues[0],10) : 0;
if (Queues<1) { // potential fix for Steam error
	Queues = 3;
};
console.log("SQS - queues expected:",Queues);
Style.textContent = "#QueueButton {Min-Width: 100px; Text-Align: Center;}";
Button.id = "QueueButton";
Button.className = "btnv6_blue_hoverfade btn_medium";
if (Object.keys(GStoreItemData.rgAppData).length==0) { // if page queue is empty
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
	var Ids = Queue || Object.keys(GStoreItemData.rgAppData);
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
	Data.set("sessionid",g_sessionID);
	Data.set("queuetype",0);
	fetch(Address,Init)
	.then((Data)=>(Data.json()))
	.then((Data)=>{
		GStoreItemData.rgAppData = Data.rgAppData; // writing for fallback
		if (GStoreItemData.rgAppData==undefined) { // IDK why it's happening; need testing
			console.log("SQS - bad response:",Data.rgAppData,Data.queue,"\r\n",Data);
			GStoreItemData.rgAppData = {};
		};
		console.log("SQS - queue generated");
		QueueGet(null,Data.queue);
	})
	.catch((Error)=>{console.error("SQS -",Error);});
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
	Data.set("sessionid",g_sessionID);
	Data.set("appid_to_clear_from_queue",Id);
	fetch(Address,Init).catch((Error)=>{console.error("SQS -",Error);});
	Button.textContent = `Spin (${Queues*12+Ids.length})`;
};