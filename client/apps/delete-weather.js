"use strict";

let deleteHistory = document.getElementById("delete-weather-fromDB");
let deleteButton = document.getElementById("delete-button");
let deletePass = document.getElementById("delete-password");
const deleteFunction = async () => {
	let inputValue = deleteHistory.value;
	let passVal = deletePass.value;
	const res = await fetch(`/api/history/${inputValue}`, {
		method: "DELETE",
		body: JSON.stringify({ password: passVal }),
		headers: {
			"content-type": "application/json; charset=UTF-8",
		},
	});

	if (!res.ok) {
		alert("something went wrong\nPlease try again");
		console.log(`Error from respons deleteFunction: ${res}`);
		return;
	}

	const data = await res.json();

	alert(`${data.message}`);

	deleteHistory.value = "";
	deletePass.value = "";
};

deleteButton.onclick = deleteFunction;
