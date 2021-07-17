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
	res.send(posts);
});

app.post("/posts", async (req, res) => {
	const id = randomBytes(4).toString("hex");
	const { title } = req.body;

	posts[id] = {
		id,
		title,
	};

	// Emit the event to the event bus
	await axios
		.post("http://localhost:4005/events", {
			type: "PostCreated",
			data: {
				id,
				title,
			},
		})
		.catch((err) => console.log(err.message));

	res.status(201).send(posts[id]);
});

app.listen(4000, () => {
	console.log("Posts service started on port 4000");
});
