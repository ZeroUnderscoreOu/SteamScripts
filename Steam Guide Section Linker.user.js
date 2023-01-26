// ==UserScript==
// @name        Steam Guide Section Linker
// @author      ZeroUnderscoreOu
// @version     1.0.0
// @icon        
// @description Provides easy way to copy section links from Steam guides.
// @namespace   https://github.com/ZeroUnderscoreOu/
// @match       https://steamcommunity.com/sharedfiles/filedetails/*
// @run-at      document-idle
// @grant       none
// ==/UserScript==

var CustomStyle = document.createElement("Style");

CustomStyle.textContent = `
	A.SGSL {Display: None;}
	*.guideSubSectionSelection:Hover A.SGSL {Display: Unset;}
`;
document.head.append(CustomStyle);

for (let L of document.getElementsByClassName("guideSubSectionSelectionLink")) {
	let A = document.createElement("A");
	let ID = L.parentElement.id.split("_")[1]; // section ID
	if (ID == "0") { // there's no dedicated ID for overview section; using top navigation instead (will break someday)
		ID = "#global_header";
	};
	A.href = `#${ID}`;
	A.className = "SGSL";
	A.textContent = "\uD83D\uDD17"; // 🔗 link emoji
	L.prepend(A);
};
