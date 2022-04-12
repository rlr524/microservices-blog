/**
 * @description The query service is the application's presentation logic.
 */

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
	if (type === "PostCreated") {
		const { id, title } = data;

		posts[id] = { id, title, comments: [] };
	}

	if (type === "CommentCreated") {
		const { id, content, postid, status } = data;

		const post = posts[postid];
		post.comments.push({ id, content, status });
	}

	if (type === "CommentUpdated") {
		const { id, content, postid, status } = data;

		const post = posts[postid];
		const comment = post.comments.find((comment) => {
			return comment.id === id;
		});

		comment.status = status;
		comment.content = content;
	}
};

app.get("/posts", (req, res) => {
	res.status(200).json({
		success: true,
		data: posts,
	});
});

app.post("/events", (req, res) => {
	const { type, data } = req.body;

	handleEvent(type, data);

	res.status(200).json({
		success: true,
	});
});

app.listen(4002, async () => {
	console.log("Query service started on port 4002");
	try {
		const res = await axios
			.get("http://localhost:4005/events")
			.catch((err) => console.log(err.message));

		for (let event of res.data) {
			console.log(`Processing event: ${event.type}`);
			handleEvent(event.type, event.data);
		}
	} catch (error) {
		console.log(error.message);
	}
});
