/*
As far as I understand, source parameter marks location from which game was nominated:
1 - store page
2 - awards page, suggested game
3 - awards page, search result game
*/

var Link = "https://store.steampowered.com/steamawards/nominategame";
var Nominations = [
	583950,
	34270,
	286160,
	4,
	554620,
	386940,
	646570,
	544390
];
var Form = new FormData();
var Init = {
	method: "Post",
	credentials: "include",
	body: Form
};
Form.append("sessionid",g_sessionID);
Form.append("source",3);
NominationPost();

function NominationPost(CategoryId=1) {
	Form.set("nominatedid",Nominations[CategoryId-1]);
	Form.set("categoryid",CategoryId);
	fetch(Link,Init).then((Data)=>(Data.json())).then((Data)=>{
		if (Data) {
			Data = Data.rgCategories[CategoryId-1].label;
		};
		console.log(Data);
		if (CategoryId!=Nominations.length) {
			setTimeout(NominationPost,1000,++CategoryId);
		} else {
			document.location.href = "https://store.steampowered.com/SteamAwardNominations";
		};
	}).catch((Message)=>{console.error("SteamNominations error:",Message);});
};