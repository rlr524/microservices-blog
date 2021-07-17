const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
	res.status(200).json(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
	const postID = req.params.id;
	const commentID = randomBytes(4).toString("hex");
	const { content } = req.body;

	const comments = commentsByPostId[postID] || [];

	comments.push({ id: commentID, content });

	commentsByPostId[postID] = comments;

	await axios
		.post("http://localhost:4005/events", {
			type: "CommentCreated",
			data: {
				id: commentID,
				content,
				postId: postID,
			},
		})
		.catch((err) => {
			console.log(err.message);
		});

	res.status(201).json(comments);
});

app.post("/events", (req, res) => {
	console.log("Received event", req.body.type);

	res.status("200").json({
		success: true,
	});
});

app.listen(4001, () => {
	console.log("Comments service started on port 4001");
});
