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

// Handle register

const registerForm = document.getElementById("signupForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("signupEmail").value;
        const fullname = document.getElementById("signupName").value;
        const phone = document.getElementById("Celular").value;

        fetch("http://localhost:3001/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, fullname, phone }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    updateUserInState(data.user);
                    window.location.href = `/auth.html?id=${data.user._id}`;
                } else {
                    alert("Error en el registro");
                }
            })
            .catch(error => console.log("Hubo un error: ", error));
    });
}

// Handle login

const loginForm = document.getElementById("loginForm");
if (loginForm) {
	loginForm.addEventListener("submit", function (event) {
		event.preventDefault();
		const email = document.getElementById("loginEmail").value;

		fetch("http://localhost:3001/user", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		})
			.then(response => response.json())
			.then(data => {
				if (data.user) {
					updateUserInState(data.user);
					window.location.href = `/auth.html?id=${data.user._id}`
				} else {
					alert("Error en al ingresar")
				}
			})
			.catch(error => console.log("Hubo un error: ", error));

	})

};

// Handle logout

const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
	logoutButton.addEventListener("click", function () {
		localStorage.removeItem(LS_KEY);
		state = { user: {} };
		window.location.href = "/index.html";
	});
}

// Load users for market.html

if (document.getElementById("userList")) {
	fetch("http://localhost:3001/user")
		.then(response => response.json())
		.then(data => {
			const userList = document.getElementById("userList");
			data.data.forEach(user => {
				const userItem = document.createElement("li");
				userItem.classList.add('list-group-item d-flex justify-content-between align-items-start');

				const userContent = document.createElement("div");
				userContent.classList.add('ms-2 me-auto');

				const userBold = document.createElement("div");
				userBold.classList.add('fw-bold');
				userBold.textContent = user.fullname;

				const skillsList = document.createElement("ul");
				skillsList.classList.add('list-group');
				user.skills.forEach(skills => {
					const skillItem = document.createElement("li").classList.add('list-group-item')
					skillItem.textContent = skills;
					skillsList.appendChild(skillItem);
				})

				const badge = document.createElement("span");
				badge.classList.add('badge text-bg-primary rounded-pill');
				badge.textContent = user.skills.length;

				userContent.appendChild(userBold);
				userItem.appendChild(userContent);
				userItem.appendChild(badge);
				userItem.appendChild(skillsList);

				userList.appendChild(userItem);
			})

		})
		.catch(error => console.error("Error al buscar usuarios: ", error))
}


