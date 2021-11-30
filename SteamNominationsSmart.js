// 1.1.1-2021Autumn
/*
As far as I understand, source parameter marks location from which game was nominated:
1 - store page
2 - awards page, suggested game
3 - awards page, search result game
*/

var LinkNominate = "https://store.steampowered.com/steamawards/nominategame";
var LinkCategory = "https://store.steampowered.com/steamawards/category/";
var Nominations = [ // fallback nominations
	601840,  // Griftlands
	1255560, // Myst
	10,      // Counter-Strike
	1509960, // PICO PARK
	593640,  // Papetura
	893720,  // One Hand Clapping
	1110910, // Mortal Shell
	1038370, // Trials of Fire
	1091500, // Cyberpunk 2077
	990630   // The Last Campfire
];
var Shift = 61; // starting nomination index; continues from previous year
var Suggestions = []; // storing used suggestions; can't nominate same game multiple types
Form = new FormData();
var Init = {
	method: "Post",
	credentials: "include",
	body: Form
};
if (!g_sessionID) {
	var g_sessionID = document.cookie.match(/sessionid=([^;]+)/);
	if (g_sessionID) {
		g_sessionID = g_sessionID[1];
		Form.append("sessionid",g_sessionID);
		Form.append("source",3);
		OutsmartingGabe();
	} else {
		console.error("Can't get session Id");
	};
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
	Form.set("categoryid",Nomination+Shift); // nomination Ids increase over years
	fetch(LinkNominate,Init).then((Data)=>(Data.json())).then((Data)=>{
		if (Data) {
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
