const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { randomBytes } = require("crypto");

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
	res.status(200).json(posts);
});

app.post("/posts", async (req, res) => {
	const id = randomBytes(4).toString("hex");
	const { title } = req.body;

	posts[id] = {
		id,
		title,
	};

	/**
	 * @event PostCreated
	 * @description Emitted to the event bus upon the creation of a new post
	 * @property type: PostCreated *string
	 * @property data.id: Postid *string
	 * @property: data.title: title *string
	 */
	await axios
		.post("http://event-bus-srv:4005/events", {
			type: "PostCreated",
			data: {
				id,
				title,
			},
		})
		.catch((err) => console.log(err.message));

	res.status(201).json({
		success: true,
		postid: posts[id],
	});
});

// TODO: Update this to get full date and local time and post ID
app.post("/events", (req, res) => {
	console.log(
		`Received event at ${
			year +
			"-" +
			month +
			"-" +
			date +
			" " +
			hours +
			":" +
			minutes +
			":" +
			seconds
		}: ${req.body.type} - PostID: ${req.body.data.id}`
	);

	res.status("200").json({
		success: true,
	});
});

app.listen(4000, () => {
	console.log("Version 0.0.5");
	console.log("Posts service started on port 4000");
});
