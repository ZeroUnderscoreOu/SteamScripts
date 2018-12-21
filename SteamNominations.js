// 1.0.0-Winter2018

var Link = "https://store.steampowered.com/salevote";
var Nominations = [
	863550,
	617830,
	570,
	32989758,
	750920,
	730,
	289070,
	227300
];
var Form = new FormData();
var Init = {
	method: "Post",
	credentials: "include",
	body: Form
};
Form.append("sessionid",g_sessionID);
NominationPost();

function NominationPost(VoteId=1) {
	if (VoteId==4) { //developer nomination
		Form.set("appid",0);
		Form.set("developerid",Nominations[VoteId-1]);
	} else {
		Form.set("appid",Nominations[VoteId-1]);
		Form.set("developerid",0);
	};
	Form.set("voteid",VoteId+25); // first index is 26
	fetch(Link,Init).then((Data)=>(Data.text())).then((Data)=>{
		Data = Data.match(/breakafter">\s+(.*?)\s+<\/div>/);
		Data = Data ? Data[1] : "No data";
		console.log(Data);
		if (VoteId!=Nominations.length) {
			setTimeout(NominationPost,1000,++VoteId);
		} else {
			document.location.href = "https://store.steampowered.com/SteamAwards/2018/";
		};
	}).catch((Message)=>{console.error("SteamNominations error:",Message);});
};