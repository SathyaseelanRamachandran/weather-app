"use strict";

import { sendToSave } from "./api.js";
let theName = document.getElementById("your-name");
const saveButton = document.getElementById("add-history-button");
let userPassword = document.getElementById("add-password");

const saveFunction = async (event) => {
	const userName = theName.value;
	const pasVal = userPassword.value;
	sendToSave.password = pasVal;
	// let bodyContent = {
	// 	city: sendToSave.city,
	// 	country: sendToSave.country,
	// 	time: sendToSave.time,
	// 	status: sendToSave.status,
	// 	temp: sendToSave.temp,
	// };

	const res = await fetch(`/api/history/${userName}`, {
		method: "POST",
		body: JSON.stringify(sendToSave),
		headers: {
			"content-type": "application/json; charset=UTF-8",
		},
	});

	if (!res.ok) {
		alert(
			"Something went wrong!\nDid you used any special characters?\nSuch as: / or back slash "
		);
		console.log("error from save-weather.js, res is: ", res);
	} else {
		const data = await res.json();
		alert(data.message);
	}
	theName.value = "";
	userPassword.value = "";
	event.preventDefault();
};

saveButton.onclick = saveFunction;
