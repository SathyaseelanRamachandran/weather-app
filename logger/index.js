"use strict";

const fs = require("fs");

const path = `./data/logs.txt`;

const logs = (req, res, next) => {
	const reqTime = new Date();

	const reqMethod = req.method;
	const reqUrl = req.url;
	const connections = req.headers["user-agent"];
	const reqResults = `${reqMethod} ${reqUrl} REQTIME: ${reqTime} user-agent: ${connections}`;

	fs.appendFile(path, `${reqResults}\n`, (err) => {
		if (err) {
			console.error("Error from writing logs: ", err);
		}
	});
	console.log(reqResults);
	next();
};

module.exports = logs;
