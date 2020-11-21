"use strict";
// get HTML elements
let searchInputCity = document.getElementById("search-input-city");
const searchButton = document.getElementById("search-button");
const currentDayTitle = document.getElementById("current-day-title");
const locationName = document.getElementById("location-name");
const weatherStatusIcon = document.getElementById("weather-status-icon");
const locationDataTime = document.getElementById("location-data-time");
const locationTempMetric = document.getElementById("location-temp");
const locationTempFahrenheit = document.getElementById("location-temp-f");
const additionalWeatherInfo = document.getElementById(
	"additional-weather-info"
);

const forecastAdditionalInfo = document.getElementById(
	"forecast-additional-info"
);
const weatherForecast = document.querySelector(".weather-forecast");
const pageTitle = document.querySelector("title");
const a = document.getElementById("current-day-title");
const b = document.getElementById("current-day-title");

export let sendToSave = {};
const accessKey = "86ceed49db6ce4d2a0d1e0e533ee309d";

async function fetchData() {
	let currentLocationCity = searchInputCity.value;
	const baseUrl = `http://api.weatherstack.com/current?access_key=${accessKey}&query=${currentLocationCity}`;
	const res = await fetch(baseUrl);
	// check of respons are ok
	if (!res.ok) {
		alert(
			`Sorry, we have no information about the city ( ${currentLocationCity} )`
		);
		console.log("the res is: ", res);
		return;
	}
	const data = await res.json();
	console.log("data from weatherstack: ", data);
	// seven days of the week
	const daysArr = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	// necessary data to display to users
	let time_data = data.location.localtime;
	let temp_data = data.current.temperature;
	let city = data.location.name;
	let country = data.location.country;
	let statusArr = data.current.weather_descriptions;

	// store it to object to be able to get from another files
	sendToSave.time = time_data;
	sendToSave.temp = temp_data;
	sendToSave.city = city;
	sendToSave.country = country;
	sendToSave.status = statusArr;
	// get the current day's number and
	const createDate = new Date();
	let daysNum = Number(createDate.getDay());
	currentDayTitle.textContent = `Today: ${daysArr[daysNum]}`;

	locationName.innerHTML = `<span>${city}</span><br><br><span>${country}</span>`;
	pageTitle.innerHTML = `${city} | ${country}`;
	/*
	 *
	 *
	 */
	weatherStatusIcon.innerHTML = "";
	let spanIcon = document.createElement("span");

	let imgIcon = document.createElement("img");
	imgIcon.src = `${data.current.weather_icons}`;
	spanIcon.appendChild(imgIcon);
	weatherStatusIcon.appendChild(spanIcon);
	/**
	 * if there are multiple status for the weather
	 */

	for (let i = 0; i < statusArr.length; i++) {
		let spanStatus = document.createElement("span");
		spanStatus.innerHTML = `<br>${statusArr[i]}`;
		weatherStatusIcon.appendChild(spanStatus);
	}

	const formatTime = time_data.split(" ");
	locationDataTime.innerHTML = `<span>${formatTime[0]}</span><br><br><span>${formatTime[1]}</span>`;
	let toFahrenheit = Number(temp_data) * (9 / 5) + 32;
	locationTempMetric.innerHTML = `${Math.round(temp_data)} °C`;
	locationTempFahrenheit.innerHTML = `${Math.round(toFahrenheit)} °F`;

	// for the additional weather info

	additionalWeatherInfo.innerHTML = `
    <span>Feels like: ${data.current.feelslike}</span><br>
    <span>Humidity: ${data.current.humidity}</span><br>
    <span>Weather Code: ${data.current.weather_code}</span><br>
    <span>Wind Direction: ${data.current.wind_dir}</span><br>
    <span>Wind Speed: ${data.current.wind_speed}</span><br>
    <span>Wind Degree: ${data.current.wind_degree}</span><br>`;

	/**

        Render the following to the user
            moonrise: "01:56 AM"
            moonset: "01:29 PM"
            sunrise: "05:13 AM"
            sunset: "06:30 PM"
 */

	const forecastBaseUrl = `http://api.weatherstack.com/forecast?access_key=${accessKey}&query=${currentLocationCity}`;
	const forecastRes = await fetch(forecastBaseUrl);
	const forecastData = await forecastRes.json();
	for (let item in forecastData.forecast) {
		forecastAdditionalInfo.innerHTML = `
        <span>Sunrise: ${forecastData.forecast[item].astro.sunrise}</span><br>
        <span>Sunset: ${forecastData.forecast[item].astro.sunset}</span><br>
        <span>Moonrise: ${forecastData.forecast[item].astro.moonrise}</span><br>
        <span>Moonset: ${forecastData.forecast[item].astro.moonset}</span><br>`;
	}
	/**
	 * open weather forecast the weather of five days in advance
	 *
	 * https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
	 */

	let openWeatherKey = "5e7a5d73484093b9845d1a913b7ba854";
	const forecastBaseUrlOW = `https://api.openweathermap.org/data/2.5/forecast?q=${currentLocationCity}&units=metric&appid=${openWeatherKey}`;

	const forecastResOW = await fetch(forecastBaseUrlOW);
	const forecastDataOW = await forecastResOW.json();
	console.log("forecast openweather: ", forecastDataOW);
	weatherForecast.innerHTML = "";
	if (forecastDataOW.list) {
		for (let i = 0; i < forecastDataOW.list.length; i++) {
			let currentDate = forecastDataOW.list[i].dt_txt.split(" ")[0];
			let nextDate;
			// reassign the 'nextDate' only if the 'i + 1' is not greater than  'forecastDataOW.list.length'
			if (i < forecastDataOW.list.length - 1) {
				nextDate = forecastDataOW.list[i + 1].dt_txt.split(" ")[0];
			}
			// if you want to display only the weather of everyday and not every 3 hours, you need do it with a different date
			if (currentDate !== nextDate) {
				let secEl = document.createElement("section");
				let h5Day = document.createElement("h5");
				let h5Date = document.createElement("h5");
				let h5Weather = document.createElement("h5");
				let h5Degree = document.createElement("h5");

				h5Day.innerHTML = `${daysArr[daysNum]}`;
				// set the correct day for each next day
				if (daysNum < daysArr.length - 1) {
					daysNum++;
				} else {
					daysNum = 0;
				}

				h5Date.innerHTML = `${currentDate}`;
				h5Weather.innerHTML = `${forecastDataOW.list[i].weather[0].main}`;
				h5Degree.innerHTML = `<span>${Math.round(
					forecastDataOW.list[i].main.temp_min
				)}</span> ~ <span>${Math.round(
					forecastDataOW.list[i].main.temp_max
				)} °C</span>`;

				secEl.appendChild(h5Day);
				secEl.appendChild(h5Date);
				secEl.appendChild(h5Weather);
				secEl.appendChild(h5Degree);

				weatherForecast.appendChild(secEl);
			}
		}
		searchInputCity.value = "";
	} else {
		alert(
			`No forecast for the given city name\n Type the city name correctly!\n
			${forecastDataOW.message}`
		);
		searchInputCity.value = "";
		return;
	}
}

searchButton.onclick = fetchData;
