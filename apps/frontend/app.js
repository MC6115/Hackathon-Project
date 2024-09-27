const LS_KEY = "trade.skills";
const BACKEND_URL = "http://localhost:3001"; 

// state to use with local storage
let state;

// load from local storage
function loadState() {
	let getState = localStorage.getItem(LS_KEY);
	if (getState) {
		const objectState = JSON.parse(getState);
		if (objectState.user) {
			state = objectState;
		} else {
			state = null;
		}
	}
}

// use state from local storage on page load
function pageLoad() {
	loadState();
	const currentPage = window.location.pathname;

	if (state && currentPage.includes("index")) {
		window.location.href = "/apps/frontend/home.html";
	} else if (!state && currentPage.includes("auth")) {
		return;
	} else if (!state && !currentPage.includes("index")) {
		window.location.href = "/apps/frontend/index.html";
	}
}

pageLoad();

// update state in local storage:
function updateUserInState(newUser) {
	console.log("newUser", newUser);
	const newState = { user: newUser };
	let stringify = JSON.stringify(newState);
	localStorage.setItem(LS_KEY, stringify);
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
                    window.location.href = `./auth.html?id=${data.user._id}`;
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
					window.location.href = `./auth.html?id=${data.user._id}`
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
		window.location.href = "./index.html";
	});
}

// Load users for market.html

if (document.getElementById("userList")) {
	fetch("http://localhost:3001/users")
		.then(response => response.json())
		.then(data => {
			const userList = document.getElementById("userList");
			data.data.forEach(user => {
				const userItem = document.createElement("li");
				userItem.classList.add('list-group-item', 'd-flex', 'justify-content-between');

				const userContent = document.createElement("div");
				userContent.classList.add('ms-2', 'me-auto');

				const userBold = document.createElement("div");
				userBold.classList.add('fw-bold');
				userBold.textContent = user.fullname;

				const skillsList = document.createElement("ul");
				skillsList.classList.add('list-group');
				user.skills.forEach(skills => {
					const skillItem = document.createElement("li")
					skillItem.classList.add('list-group-item')
					skillItem.textContent = skills;
					skillsList.appendChild(skillItem);
				})

				const badge = document.createElement("span");
				badge.classList.add('badge', 'text-bg-primary');
				badge.textContent = user.phone;

				userContent.appendChild(userBold);
				userItem.appendChild(userContent);
				userItem.appendChild(badge);
				userItem.appendChild(skillsList);

				userList.appendChild(userItem);
			})

		})
		.catch(error => console.error("Error al buscar usuarios: ", error))
}

// new skill handler
if(document.getElementById('skillForm')){
document.getElementById('skillForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const newSkill = document.getElementById('newSkill').value;

    if (newSkill) {
        addSkill(newSkill)
            .then(() => {
                document.getElementById('newSkill').value = '';
            })
            .catch(error => {
                console.log("Hubo un error:", error);
                alert("Error al agregar la habilidad.");
            });
    } else {
        alert("Por favor, ingrese una habilidad.");
    }
});
}

const addSkill = async (newSkill) => {
    const user = JSON.parse(localStorage.getItem('trade.skills'));
    const userId = user.user._id;
	console.log(user,userId)

    fetch("http://localhost:3001/skill", {
        method: 'POST',
        headers: {	
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            skill: newSkill
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            localStorage.setItem('trade.skills', JSON.stringify(data.user));

            updateUserInState(data.user);

            window.location.href = `./auth.html?id=${data.user._id}`;//
        } else {
            alert("Error al agregar el skill.");
        }
    })
    .catch(error => {
        console.log("Hubo un error:", error);
        alert("Error en la solicitud. Inténtalo de nuevo.");
    });
};