"use strict";

const express = require("express");
const router = express.Router();
const handlers = require("./handlers.js");
router.post("/renderhistory", handlers.renderHistory);
//router.get("/renderhistory/:name/:password", handlers.renderHistory);
router.post("/history/:name", handlers.saveHistory);
router.put("/history", handlers.updateHistory);
router.delete("/history/:name", handlers.deleteHistory);
router.post("/messages", handlers.usersMessage);
router.get("/messages", handlers.renderMessages);

router.get("/testing", (req, res) => {
	res.send({ test: "it is working" });
});

module.exports = router;
