var Link = "http://store.steampowered.com/promotion/nominategame";
var Nominations = [
	95400,
	554620,
	730,
	221640,
	201210,
	375750,
	304650,
	319630,
	643270,
	262830,
	392110,
	286160,
	10
];
var WriteIn = "Where it all begins";
var Form = new FormData();
var Init = {
	method: "Post",
	credentials: "include",
	body: Form
};
Form.append("sessionid",g_sessionID);
NominationPost();

function NominationPost(CategoryId=1) {
	var AppId = Nominations[CategoryId-1];
	Form.set("appid",AppId);
	Form.set("categoryid",CategoryId);
	if (CategoryId==Nominations.length) {
		Form.append("writein",WriteIn);
	};
	fetch(Link,Init).then((Data)=>(Data.json())).then((Data)=>{
		if (Data) {
			Data = Data.rgCategories[CategoryId-1].label;
		};
		console.log(Data);
		if (CategoryId!=Nominations.length) {
			setTimeout(NominationPost,1000,++CategoryId);
		} else {
			document.location.reload();
		};
	}).catch((Message)=>{console.error("SteamNominations error:",Message);});
};