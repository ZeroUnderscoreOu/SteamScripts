// // 1.1.0-2020Winter

var Votes = { // leave empty for random votes
	50: "1145360", // Hades
	51: "546560",  // Half-Life: Alyx
	52: "275850",  // No Man's Sky
	53: "632360",  // Risk of Rain 2
	54: "1049410", // Superliminal
	55: "1222140", // Detroit: Become Human
	56: "1172470", // Apex Legends
	57: "1057090", // Ori and the Will of the Wisps
	58: "976730",  // Halo: The Master Chief Collection
	59: "1250410"  // Microsoft Flight Simulator
};

function GetIds() {
	Object.values(g_rgVideoConfig).forEach((Value)=>{
		let Category = Value.voteid;
		let Ids = Object.keys(Value.videoFeatureTimes);
		Votes[Category] = Ids[Math.floor(Math.random()*Ids.length)];
	});
	PostVotes();
};

function PostVotes([Category,Id]=[-1,-1]) {
	if (Category==-1) {
		console.log("All done");
		return;
	};
	var Link = "https://store.steampowered.com/salevote";
	var Init = {
		method: "Post",
		mode: "cors",
		credentials: "include",
		body: new FormData()
	};
	Init.body.append("sessionid",g_sessionID);
	Init.body.append("voteid",Category);
	Init.body.append("appid",Id);
	Init.body.append("developerid",0);
	fetch(Link,Init).catch((Message)=>{
		console.error("Voting error:",Message);
	});
	setTimeout(PostVotes,1000,Votes.pop());
};

if (Object.keys(Votes).length>0) {
	Votes = Object.entries(Votes);
	PostVotes(Votes.pop());
} else {
	GetIds();
};