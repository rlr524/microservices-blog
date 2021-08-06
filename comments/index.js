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

	// Create a new comment
	comments.push({ id: commentID, content, status: "pending" });

	commentsByPostId[postID] = comments;

	/**
	 * @event CommentCreated
	 * @description Emitted to the event bus upon the additon of a new comment to a post's comment array
	 * @property type: CommentCreated
	 * @property data.id: commentID
	 * @property data.content
	 * @property data.postID: postID
	 * @property data.status: "", "pending", "approved"
	 */
	await axios
		.post("http://localhost:4005/events", {
			type: "CommentCreated",
			data: {
				id: commentID,
				content,
				postID: postID,
				status: "pending",
			},
		})
		.catch((err) => {
			console.log(err.message);
		});

	res.status(201).json({
		success: true,
		comments,
	});
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
