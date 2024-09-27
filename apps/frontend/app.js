"use strict";

const LS_KEY = "trade.skills";

// state to use with local storage
let state = {
	user: {},
};

// load from local storage
function loadState() {
	let getState = localStorage.getItem(LS_KEY);
	if (getState) {
		console.log(getState); //
		state = JSON.parse(getState);
		console.log(state); //
	}
}

// use state from local storage on page load
function pageLoad() {
	console.log("pageLoad");
	let savedState = localStorage.getItem(LS_KEY);
	if (!savedState) {
		return;
	}
	loadState();
}

pageLoad();

// update state in local storage
function updateUserInState(newUser) {
	const newState = { user: newUser };
	let stringify = JSON.stringify(newState);
	localStorage.setItem(LS_KEY, stringify);
	console.log(stringify); //
}

// ---> Aquí deberías empezar tu código propio:
