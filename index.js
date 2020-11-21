"use strict";

const express = require("express");
const config = require("./config");
const app = express();
const path = require("path");
const api = require("./api");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	morgan("combined", {
		stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
			flags: "a",
		}),
	})
);
if (config.MODE === "development") {
	app.use(morgan("dev"));
}
app.use("/", express.static(path.join(__dirname, "client")));

app.use("/api", api);
// in case if there is any error
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).end();
});
app.listen(config.PORT, () => {
	console.log(
		`Listening to http://localhost:${config.PORT} Environment MODE: (${config.MODE})`
	);
});
