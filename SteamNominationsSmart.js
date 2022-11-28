// 1.1.3-2022Autumn
/*
As far as I understand, source parameter marks the location from which a game was nominated:
1 - store page, skipped nominations
2 - awards page, suggested game
3 - awards page, search result game
Can also use new URL to post nominations
https://store.steampowered.com/steamawards/ajaxnominategame
*/

var LinkNominate = "https://store.steampowered.com/steamawards/nominategame";
var LinkCategory = "https://store.steampowered.com/steamawards/category/";
var Nominations = [ // fallback nominations
	1245620, // ELDEN RING
	1599560, // Wanderer; use 2215130 to skip
	2004320, // Duelyst II
	1385380, // Across the Obelisk
	698670,  // Scorn
	1260520, // Patrick's Parabox
	1494260, // Loot River
	1332010, // Stray
	1221250, // NORCO
	1622770, // Doors: Paradox
	1794680  // Vampire Survivors; use 2218020 to skip
];
var Shift = 72; // starting nomination index; continues from previous year
var Suggestions = []; // storing used suggestions; can't nominate same game multiple types
var Form = new FormData();
var Init = {
	method: "Post",
	credentials: "include",
	body: Form
};
var Session;

try {
	Session = g_sessionID;
} catch {
	try {
		Session = document.cookie.match(/sessionid=([^;]+)/)[1];
	} catch(Data) {
		console.log("Can't get session Id",Data);
	};
};

if (Session) {
	Form.append("sessionid",Session);
	Form.append("source",3);
	OutsmartingGabe();
};

function OutsmartingGabe(Nomination=0) {
	fetch(`${LinkCategory}${Nomination+Shift}`,{credentials:"include"})
	.then((Data)=>(Data.text()))
	.then((Data)=>{
		Data = Data.match(/data-ds-appid="\d+"/g);
		if (Data) {
			Data = Data.map((Id)=>(parseInt(Id.match(/\d+/)[0]))); // for filter() to work & for consistency
			Data = Data.filter((Id)=>(!(Nominations.includes(Id)||Suggestions.includes(Id)))); // removing duplicates, if any
			if (Data.length) { // if any suggetstions present
				let A = Math.floor(Math.random()*Data.length);
				Nominations[Nomination] = Data[A];
				Suggestions.push(Data[A]);
				console.log(`#${Nomination} - new nomination ${Data[A]}`);
				console.log(Suggestions);
			} else {
				console.log(`#${Nomination} - no suggestions; using fallback`);
			};
		} else {
			console.log(`#${Nomination} - no suggestions; using fallback`);
		};
		NominationPost(Nomination);
		if (++Nomination<Nominations.length) {
			setTimeout(OutsmartingGabe,1000,Nomination);
		};
	}).catch((Data)=>{console.error("Nominating error:",Data)});
};

function NominationPost(Nomination) {
	Form.set("nominatedid",Nominations[Nomination]);
	Form.set("categoryid",Nomination+Shift); // nomination Ids increase over the years
	fetch(LinkNominate,Init).then((Data)=>(Data.json())).then((Data)=>{
		if (Data&&Data.success==1) {
			Data = Data.rgCategories[Nomination].label;
		};
		console.log(Data);
		if (Nomination==Nominations.length-1) {
			console.log("All done, opening the Steam Awards page");
			setTimeout(()=>{
				document.location.href = "https://store.steampowered.com/steamawards/nominations";
			},3000);
		};
	}).catch((Message)=>{console.error("Posting error:",Message);});
};
