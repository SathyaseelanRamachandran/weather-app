"use strict";

import { sendToSave } from "./api.js";
let theName = document.getElementById("your-name");
const saveButton = document.getElementById("add-history-button");
let userPassword = document.getElementById("add-password");

const saveFunction = async (event) => {
	const userName = theName.value;
	const pasVal = userPassword.value;
	sendToSave.password = pasVal;

	const res = await fetch(`/api/history/${userName}`, {
		method: "POST",
		body: JSON.stringify(sendToSave),
		headers: {
			"content-type": "application/json; charset=UTF-8",
		},
	});

	if (!res.ok) {
		alert("Something went wrong!\nPlease try again ");
		console.log("error from save-weather.js, res is: ", res);
	} else {
		const data = await res.json();
		alert(data.message);
	}
	theName.value = "";
	userPassword.value = "";
};

saveButton.onclick = saveFunction;
userPassword.onkeyup = function (event) {
	if (event.keyCode !== 13) {
		return;
	}
	saveFunction();
};
