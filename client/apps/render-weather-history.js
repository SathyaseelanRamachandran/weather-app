"use strict";

let renderBox = document.getElementById("user-history-box");
let unFirst = document.getElementById("search-weather-inDB");
let upSecond = document.getElementById("search-password");
const searchHistoryButton = document.getElementById("search-history-button");

const renderFunction = async () => {
	renderBox.innerHTML = "";
	const first = unFirst.value;
	const second = upSecond.value;
	const res = await fetch(`/api/renderhistory`, {
		method: "POST",
		body: JSON.stringify({
			first: first,
			second: second,
		}),
		headers: {
			"content-type": "application/json; charset=UTF-8",
		},
	});
	const data = await res.json();
	if (!res.ok) {
		alert("Something went wrong, please try again!");
		console.log("Error from renderf, res is not ok: ", res);
		return;
	}
	if (data.message) {
		alert(data.message);
		unFirst.value = "";
		upSecond.value = "";
		return;
	}
	let tableBox = document.createElement("table");
	// create table header row
	let trFirst = document.createElement("tr");
	// create table headers
	let thElName = document.createElement("th");
	thElName.textContent = "Name";
	let thElCity = document.createElement("th");
	thElCity.textContent = "City";
	let thElCountry = document.createElement("th");
	thElCountry.textContent = "Country";
	let thElTime = document.createElement("th");
	thElTime.textContent = "Date&Time";
	let thElWeatherStatus = document.createElement("th");
	thElWeatherStatus.textContent = "Weather Status";
	let thElTemperature = document.createElement("th");
	thElTemperature.textContent = "Temp";
	// append the headers in the row
	trFirst.appendChild(thElName);
	trFirst.appendChild(thElCity);
	trFirst.appendChild(thElCountry);
	trFirst.appendChild(thElTime);
	trFirst.appendChild(thElWeatherStatus);
	trFirst.appendChild(thElTemperature);
	// append the row in the table
	tableBox.appendChild(trFirst);

	// create table rows and table columns for each user and append them in the table
	for (let i = 0; i < data.length; i++) {
		let trSecond = document.createElement("tr");
		let tdFirst = document.createElement("td");
		tdFirst.innerHTML = `${data[i].name}`;
		let tdSecond = document.createElement("td");
		tdSecond.innerHTML = `${data[i].city}`;
		let tdThird = document.createElement("td");
		tdThird.innerHTML = `${data[i].country}`;
		let tdFourth = document.createElement("td");
		tdFourth.innerHTML = `${data[i].time_data}`;
		let tdFifth = document.createElement("td");
		tdFifth.innerHTML = `${data[i].weather_status.current_status[0]}`;
		let tdSixth = document.createElement("td");
		tdSixth.innerHTML = `${data[i].weather_status.temperature}`;

		trSecond.appendChild(tdFirst);
		trSecond.appendChild(tdSecond);
		trSecond.appendChild(tdThird);
		trSecond.appendChild(tdFourth);
		trSecond.appendChild(tdFifth);
		trSecond.appendChild(tdSixth);

		tableBox.appendChild(trSecond);
	}
	// append the table to the html website
	renderBox.appendChild(tableBox);

	unFirst.value = "";
	upSecond.value = "";
};

searchHistoryButton.onclick = renderFunction;
upSecond.onkeyup = function (event) {
	if (event.keyCode !== 13) {
		return;
	}
	renderFunction();
};
