var LinkPost = "https://store.steampowered.com/saleaction/ajaxopendoor";
var Form = new FormData();
var Init = {
	method: "Post",
	credentials: "include",
	body: Form,
	referrer: "https://store.steampowered.com/category/racing/?tab=15"
};
var Session;
var Token;
var Check = true;

try {
	Session = g_sessionID;
	if (!Session) {
		Session = document.cookie.match(/sessionid=([^;]+)/)[1];
	};
} catch(Data) {
	console.error("Error getting session",Data);
	Check = false;
};

try {
	let C = document.getElementById("application_config");
	Token = JSON.parse(C.getAttribute("data-userinfo")).authwgtoken;
} catch(Data) {
	console.error("Error getting token",Data);
	Check = false;
};

Form.append("sessionid",Session);
Form.append("authwgtoken",Token);

OpenDoor(0);



function OpenDoor(Door) {
	Form.set("door_index",Door);
	fetch(LinkPost,Init).then((Data)=>(Data.json())).then((Data)=>{
		console.log("Success:",Data.success);
		if (Door==4) {
			console.log("New tabID",Data.capsuleinsert.tabID);
			let tabID = Data.capsuleinsert.tabID;
			Init.referrer = `https://store.steampowered.com/category/racing/?tab=${tabID}`;
		};
		if (Door==5) {
			console.log("All done, opening the badge page");
			setTimeout(()=>{
				document.location.href = "https://steamcommunity.com/my/badges/59";
			},3000);
		} else {
			setTimeout(OpenDoor,1000,++Door);
		};
	}).catch((Message)=>{
		console.error("Posting error:",Message);
	});
};
