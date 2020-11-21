"use strict";

const path = require("path");
const config = require("../config");
const fs = require("fs");
const tv4 = require("tv4");

const SCHEMA_FILE = path.join(__dirname, "..", "data", "weather-schema.json");
const DATA_DIR = path.join(__dirname, "..", "data", "weather-history.json");
const USERS_MESSAGES_DIR = path.join(
	__dirname,
	"..",
	"data",
	"users-messages.json"
);

const handler = {
	renderHistory: async (req, res, next) => {
		const userName = req.params.name;
		const getPass = req.params.password;
		await fs.readFile(DATA_DIR, "UTF-8", (err, data) => {
			if (err) {
				console.error("error from read file: ", err);
				return;
			}

			let parsedData = JSON.parse(data);
			let arrayToSend = parsedData.weather_history_data.filter((item) => {
				if (item.name === userName && item.password === getPass) {
					return item;
				}
			});
			if (arrayToSend.length < 1) {
				res.json({
					message: `Your password is not correct or the name ( ${userName} ) does not exist in the system`,
				});
				return;
			}

			res.send(arrayToSend);
		});
	},
	saveHistory: async (req, res, next) => {
		const userName = req.params.name;
		let letterNumber = /^[0-9a-zA-Z]+$/;

		if (!userName.match(letterNumber)) {
			res.json({
				message: `The name may not contain any characters other than letters and numbers`,
			});
			return;
		}

		const weatherInfo = req.body;
		await fs.readFile(DATA_DIR, "UTF-8", (err, data) => {
			if (err) {
				console.error("Error from read file Save History: ", err);
				return;
			}
			const parsedData = JSON.parse(data);
			let toSave = {
				name: userName,
				password: weatherInfo.password,
				id: parsedData.nextId,
				city: weatherInfo.city,
				country: weatherInfo.country,
				time_data: weatherInfo.time,
				weather_status: {
					current_status: weatherInfo.status,
					temperature: `${weatherInfo.temp} °C`,
				},
			};
			const isValid = tv4.validate(toSave, SCHEMA_FILE);
			if (!isValid) {
				const error = tv4.error;
				console.error("error from validation: ", error);
				res.status(400).json({
					error: {
						message: error.message,
						dataPath: error.dataPath,
					},
				});
				return;
			}
			parsedData.nextId++;
			parsedData.weather_history_data.push(toSave);
			// save changes to the database
			const toWrite = JSON.stringify(parsedData, null, " ");
			fs.writeFile(DATA_DIR, toWrite, (err) => {
				if (err) {
					console.error("Error from write file Save History: ", err);
					return;
				}

				res.json({
					message:
						"Current weather status has been saved to the weather history!",
				});
			});
		});
	},
	updateHistory: async (req, res, next) => {
		const namesData = req.body;
		await fs.readFile(DATA_DIR, "UTF-8", (err, data) => {
			if (err) {
				console.error("Error from read file Save History: ", err);
				return;
			}
			const parsedData = JSON.parse(data);
			let entireArray = parsedData.weather_history_data;
			// check if there is a name with given name as userOldName
			let nameToChange = entireArray.filter((item) => {
				if (
					item.name === namesData.userOldName &&
					item.password === namesData.password
				) {
					return item;
				}
			});

			if (nameToChange.length < 1) {
				res.json({
					message: `Your password is not correct\nOr the name (${namesData.userOldName}) does not exist in the system\nYou have saved nothing to the weather history`,
				});
				return;
			}
			for (let i = 0; i < nameToChange.length; i++) {
				nameToChange[i].name = namesData.userNewName;
			}

			// save changes to the database
			const toWrite = JSON.stringify(parsedData, null, " ");
			fs.writeFile(DATA_DIR, toWrite, (err) => {
				if (err) {
					console.error("Error from write file Save History: ", err);
					return;
				}

				res.json({
					message: `Your name (${namesData.userNewName}) has been successfully changed in the system!`,
				});
			});
		});
	},
	deleteHistory: async (req, res, next) => {
		const userName = req.params.name;
		const userPass = req.body.password;
		await fs.readFile(DATA_DIR, "UTF-8", (err, data) => {
			if (err) {
				console.error("Error from read file Save History: ", err);
				return;
			}
			const parsedData = JSON.parse(data);
			let entireArray = parsedData.weather_history_data;
			// check if there is a name with given name as user input
			let userToDelete = entireArray.filter((item) => {
				if (item.name === userName && item.password === userPass) {
					return item;
				}
			});

			if (userToDelete.length < 1) {
				res.json({
					message: `Your password is wrong or the name (${userName}) does not exist in the system\nYou have saved nothing to the weather history to delete`,
				});
				return;
			}
			for (let i = 0; i < userToDelete.length; i++) {
				let index = entireArray.indexOf(userToDelete[i]);
				entireArray.splice(index, 1);
			}

			// save changes to the database
			const toWrite = JSON.stringify(parsedData, null, " ");
			fs.writeFile(DATA_DIR, toWrite, (err) => {
				if (err) {
					console.error("Error from write file Save History: ", err);
					return;
				}

				res.json({
					message: `All weather history with the name (${userName}) has been successfully deleted from the system!`,
				});
			});
		});
	},
	usersMessage: async (req, res, next) => {
		const messages = req.body;
		await fs.readFile(USERS_MESSAGES_DIR, "UTF-8", (err, data) => {
			if (err) {
				console.error("Error from read file Save History: ", err);
				return;
			}
			const parsedData = JSON.parse(data);
			let toSave = {
				id: parsedData.nextId,
				name: messages.name,
				subject: messages.subject,
				email: messages.email,
				message: messages.message,
			};

			parsedData.nextId++;
			parsedData.messages.push(toSave);
			// save changes to the database
			const toWrite = JSON.stringify(parsedData, null, " ");
			fs.writeFile(USERS_MESSAGES_DIR, toWrite, (err) => {
				if (err) {
					console.error("Error from write file Save Messages: ", err);
					return;
				}

				res.redirect("/contact-me.html");

				// res.json({
				// 	message: "Thank you and have great times!",
				// });
			});
		});
	},
	renderMessages: async (req, res, next) => {
		await fs.readFile(USERS_MESSAGES_DIR, "UTF-8", (err, data) => {
			if (err) {
				console.error("error from read file: ", err);
				return;
			}

			let parsedData = JSON.parse(data);

			res.send(parsedData.messages);
		});
	},
};

module.exports = handler;
