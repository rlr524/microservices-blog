const axios = require("axios");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
	const event = req.body;

	await axios
		.post("http://localhost:4000/events", event)
		.catch((err) => console.log(err.message));
	await axios
		.post("http://localhost:4001/events", event)
		.catch((err) => console.log(err.message));
	await axios
		.post("http://localhost:4002/events", event)
		.catch((err) => console.log(err.message));
	await axios
		.post("http://localhost:4003/events", event)
		.catch((err) => console.log(err.message));
	res.status("200").json({ success: true });
});

app.listen(4005, () => {
	console.log("Event bus service started on 4005");
});
