/**
 * @description The query service is the application's presentation logic.
 */

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
	res.status("200").json({
		success: true,
		data: posts,
	});
});

app.post("/events", (req, res) => {
	const { type, data } = req.body;

	if (type === "PostCreated") {
		const { id, title } = data;

		posts[id] = { id, title, comments: [] };
	}

	if (type === "CommentCreated") {
		const { id, content, postId, status } = data;

		const post = posts[postId];
		post.comments.push({ id, content, status });
	}

	console.log(posts);

	res.status("200").json({
		success: true,
	});
});

app.listen(4002, () => {
	console.log("Query service started on port 4002");
});
