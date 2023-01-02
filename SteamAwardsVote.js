// 1.3.0-2022Winter

var LinkVote = "https://store.steampowered.com/salevote";
var Votes = [ // fallback votes; empty for random
	1245620, // ELDEN RING
	1592190, // BONELAB
	570,     // Dota 2
	1144200, // Ready or Not
	698670,  // Scorn
	1637320, // Dome Keeper
	1245620, // ELDEN RING
	1462040, // FINAL FANTASY VII REMAKE INTERGRADE
	1703340, // The Stanley Parable: Ultra Deluxe
	1455840, // Dorfromantik
	1794680, // Vampire Survivors
];
var Shift = 72; // starting nomination index; continues from previous year
var NominatedApps = [];
var MarkedAsNominated = document.getElementsByClassName("user_nominated_app");

if (MarkedAsNominated.length > 0) {
	for (let App of MarkedAsNominated) {
		App = App.parentElement;
		NominatedApps[App.dataset["voteid"]] = App.dataset["voteAppid"];
		console.log(`Previously nominated app ${App.dataset["voteAppid"]} in category ${App.dataset["voteid"]}`);
	};
};

function GenerateVotes() {
	g_rgAwardSectionScrollDefs.forEach((Section) => {
		let Category = Section.voteid;
		if (Category in NominatedApps) {
			Votes[Category - Shift] = NominatedApps[Category];
		} else {
			let VoteRNG = Math.floor(Math.random() * Section.rgApps.length);
			VoteRNG = Section.rgApps[VoteRNG].dataset["voteAppid"];
			Votes[Category - Shift] = VoteRNG;
			console.log(`Randomly picked app ${VoteRNG} for Section ${Category}`);
		};
	});
	PostVotes();
};

function PostVotes(Category = 0) {
	var Init = {
		method: "Post",
		credentials: "include",
		body: new FormData()
	};
	Init.body.append("sessionid", g_sessionID);
	Init.body.append("voteid", Category + Shift);
	Init.body.append("appid", Votes[Category]);
	Init.body.append("developerid", 0);
	fetch(LinkVote, Init).catch((Message) => {
		console.error("Voting error:", Message);
	});
	if (++Category < Votes.length) {
		setTimeout(PostVotes, 500, Category);
	} else {
		console.log("Voting done");
	};
};

if (Votes.length > 0) {
	PostVotes();
} else {
	GenerateVotes();
};
