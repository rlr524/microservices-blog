const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { randomBytes } = require("crypto");

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
	 * @property type: PostCreated
	 * @property data.id: PostID
	 * @property: data.title: title
	 */
	await axios
		.post("http://localhost:4005/events", {
			type: "PostCreated",
			data: {
				id,
				title,
			},
		})
		.catch((err) => console.log(err.message));

	res.status(201).json({
		success: true,
		postID: posts[id],
	});
});

app.post("/events", (req, res) => {
	console.log("Received event", req.body.type);

	res.status("200").json({
		success: true,
	});
});

app.listen(4000, () => {
	console.log("Posts service started on port 4000");
});
