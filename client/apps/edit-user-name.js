"use strict";

let oldName = document.getElementById("change-old-name");
let newName = document.getElementById("change-new-name");
let changePass = document.getElementById("change-password");
const changeButton = document.getElementById("change-button");

const editFunction = async (event) => {
	let oldNameInput = oldName.value;
	let newNameInput = newName.value;
	let passVal = changePass.value;

	const res = await fetch(`/api/history`, {
		method: "PUT",
		body: JSON.stringify({
			userOldName: oldNameInput,
			userNewName: newNameInput,
			password: passVal,
		}),
		headers: {
			"content-type": "application/json; charset=UTF-8",
		},
	});
	if (!res.ok) {
		alert("Something went wrong, please try again!");
		console.log("res from edit-user-name.js: ", res);
	}
	const data = await res.json();
	alert(`${data.message}`);
	oldName.value = "";
	newName.value = "";
	changePass.value = "";
	event.preventDefault();
};

changeButton.onclick = editFunction;
