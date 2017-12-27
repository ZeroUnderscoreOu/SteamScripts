// ==UserScript==
// @name        Steam Queue Spinner
// @author      ZeroUnderscoreOu
// @version     1.2.0
// @icon        
// @description Spinner for your Steam Discovery Queue
// @namespace   https://github.com/ZeroUnderscoreOu/
// @match       *://store.steampowered.com/explore*
// @grant       none
// ==/UserScript==

/*
Почему относительные протокола адреса ("//") нормально работают в консоли, но выдают ошибку в GM? Пришлось жёстко вписать протокол (хотя в данном случае это не имеет большой разницы, т.к. всё равно эти адреса не поддерживают HTTPS).
Переписать стиль спэна на инлайн?
*/

"use strict";
var IntervalId;
var Queues = 3; // amount of queues to clear
var Button = document.createElement("Div");
var Div = document.querySelector("Div.discovery_queue_customize_ctn");
var Style = document.createElement("Style");
Button.id = "QueueButton";
Button.className = "btnv6_blue_hoverfade btn_medium";
Button.addEventListener("click",QueueGet);
Button = Button.appendChild(document.createElement("Span"))
Button.textContent = "Spin";
Style.textContent = "#QueueButton {Min-Width: 100px; Text-Align: Center;}";
document.head.appendChild(Style);
Div.insertBefore(Button.parentElement,Div.firstElementChild);

function QueueGet() {
	var Ids = Object.keys(GStoreItemData.rgAppData);
	console.log("SQS -",Queues--,Ids.join(", "));
	IntervalId = setInterval(QueueClear,1000,Ids);
};

function QueueGenerate() {
	var Address = "http://store.steampowered.com/explore/generatenewdiscoveryqueue";
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
		GStoreItemData.rgAppData = Data.rgAppData;
		console.log("SQS - queue generated");
		QueueGet();
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
			//Button.textContent = "Spin"; // keeping 0 as notification about end of spinning
			console.log("SQS - queues cleared");
		};
		return;
	};
	var Address = "http://store.steampowered.com/app/" + Id;
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