// ==UserScript==
// @name        Steam Awards Clicker
// @author      ZeroUnderscoreOu
// @version     1.0.2
// @icon        
// @description Clicker for a random Steam Awards vote
// @namespace   https://github.com/ZeroUnderscoreOu/
// @match       *://store.steampowered.com/SteamAwards/
// @run-at      document-idle
// @grant       none
// ==/UserScript==

let Nominations = document.querySelectorAll("Div.vote_nomination Div.btn_vote");
let Vote = Math.floor(Math.random()*Nominations.length);
Nominations[Vote].click();