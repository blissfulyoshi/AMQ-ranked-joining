// ==UserScript==
// @name         Enter Ranked
// @namespace    https://github.com/blissfulyoshi
// @version      1.0
// @description  Automate joining AMQ Ranked
// @author       You
// @match        https://animemusicquiz.com/
// @grant        none
// ==/UserScript==

if (document.getElementById('loginUsername')){
	document.getElementById('loginUsername').value = "username";
	document.getElementById('loginPassword').value = "password";
	setTimeout(function () {login()}, 1000) //login() is a function built into AMQ
}

if(document.getElementById('loadingScreen')) {
    const mutationObserver = new MutationObserver(callback)
    mutationObserver.observe(document.getElementById('loadingScreen'),{ attributes: true })
}

const enterRankedLimit = 1
var enterRankedCounter = 0;

function callback(mutationsList) {
    mutationsList.forEach(mutation => {
        if (mutation.attributeName === 'class') {
            if (mutation.target.classList.contains('hidden') && enterRankedCounter < enterRankedLimit && !document.getElementById('mainPage').classList.contains('hidden')) {
                enterRankedCounter++;
                setTimeout(function () {
                    enterRanked();
                    updateTwitchData();
                    adjustVolume();
                }, 1000)
            }
        }
    })
}

//enter ranked and remove the ranked rules notification
function enterRanked(){
	if (document.getElementById('mpRankedButton')) {
		document.getElementById('mpRankedButton').click();
        setTimeout(()=>{swal.close();},10000);
	}
}

// volumeController is a global AMQ variable for controlling volume
// set volume to 50% at the start of each game
function adjustVolume(){
    volumeController.volume = "0.5";
    volumeController.adjustVolume();
}

function updateTwitchData() {
	var header = {};
	header['Client-ID'] = 'Twitch Client Id';
	header.Authorization = 'Bearer ' + 'Authorization Key';
	header['Content-Type'] = 'application/json';

    //sketchy way to calculate ranked dates
    var offset = -6;
    var shouldBeSafeTimeForRankedDate = new Date( new Date().getTime() + offset * 3600 * 1000);
    var rankedLocation = shouldBeSafeTimeForRankedDate.getUTCHours() < 14 ? "Central" : "West"
    var formattedRankedDate = shouldBeSafeTimeForRankedDate.toISOString().split('T')[0];
    var streamTitle = 'Ranked AMQ ' + rankedLocation + ' ' + formattedRankedDate + ' (no mic)';
    //var streamTitle = "Testing Automated Streams";

    //Update Twitch information
	var data = {
		game_id: '509058',
		title: streamTitle,
		broadcaster_language:"en"
	};

	var submitRequest = $.ajax({
		url: 'https://api.twitch.tv/helix/channels?broadcaster_id=' + 'broadcaster_id',
		type: "patch",
		headers: header,
		data: JSON.stringify(data)
	});

	submitRequest.done(function (response, textStatus, jqXHR) {
		console.log(response);
	});
}
