// 1.1.0-2020Autumn
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
	546560,  // Half-Life: Alyx
	730,     // Counter-Strike: Global Offensive
	739630,  // Phasmophobia
	1049410, // Superliminal
	893850,  // The Longing
	1172470, // Apex Legends
	794960,  // The Sojourn
	719040,  // Wasteland 3
	473950,  // Manifold Garden
];
var Form = new FormData();
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
		Form.append("source",2);
		OutsmartingGabe();
	} else {
		console.log("Can't get session Id");
	};
};

function OutsmartingGabe(Nomination=1) {
	fetch(`${LinkCategory}${Nomination}`,{credentials:"include"}).then((Data)=>(Data.text())).then((Data)=>{
		Data = Data.match(/data-ds-appid="\d+"/g);
		if (Data) {
			Data = Data.map((Id)=>(parseInt(Id.match(/\d+/)[0]))); // for filter() to work & for consistency
			Data = Data.filter((Id)=>(!Nominations.includes(Id))); // removing duplicates, if any
			if (Data.length) { // if any suggetstions present
				let A = Math.floor(Math.random()*Data.length);
				Nominations[Nomination-1] = Data[A];
				console.log(`#${Nomination} - new nomination ${Data[A]}`);
			} else {
				console.log(`#${Nomination} - no suggestions; using fallback`);
			};
		} else {
			console.log(`#${Nomination} - no suggestions; using fallback`);
		};
		NominationPost(Nomination);
		if (Nomination<Nominations.length) {
			setTimeout(OutsmartingGabe,1000,++Nomination);
		};
	}).catch((Data)=>{console.error("Nominating error:",Data)});
};

function NominationPost(Nomination) {
	Form.set("nominatedid",Nominations[Nomination-1]);
	Form.set("categoryid",Nomination+49); // nomination Ids start from 50
	fetch(LinkNominate,Init).then((Data)=>(Data.json())).then((Data)=>{
		if (Data) {
			Data = Data.rgCategories[Nomination-1].label;
		};
		console.log(Data);
		if (Nomination>=Nominations.length) {
			console.log("All done, opening the Steam Awards page");
			setTimeout(()=>{
				document.location.href = "https://store.steampowered.com/steamawards/nominations";
			},3000);
		};
	}).catch((Message)=>{console.error("Posting error:",Message);});
};
