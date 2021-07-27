/**
 * @description The moderation service is used for comment moderation.
 */

const axios = require("axios");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
app.use(bodyParser.json());

app.post("/events", (req, res) => {});

app.listen(4003, () => {
	console.log("Moderation service started on port 4003");
});
