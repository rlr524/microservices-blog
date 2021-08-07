const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostid = {};

app.get("/posts/:id/comments", (req, res) => {
	res.status(200).json(commentsByPostid[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
	const postid = req.params.id;
	const commentid = randomBytes(4).toString("hex");
	const { content } = req.body;

	const comments = commentsByPostid[postid] || [];

	// Create a new comment
	comments.push({ id: commentid, content, status: "pending" });

	commentsByPostid[postid] = comments;

	/**
	 * @event CommentCreated
	 * @description Emitted to the event bus upon the additon of a new comment to a post's comment array
	 * @property type: CommentCreated *string
	 * @property data.id: commentid *string
	 * @property data.content *string
	 * @property data.postid: postid *string
	 * @property data.status: "", "pending", "approved" *string
	 */
	await axios
		.post("http://localhost:4005/events", {
			type: "CommentCreated",
			data: {
				id: commentid,
				content,
				postid,
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

app.post("/events", async (req, res) => {
	console.log("Received event", req.body.type);

	const { type, data } = req.body;

	if (type === "CommentModerated") {
		const { postid, id, status, content } = data;
		const comments = commentsByPostid[postid];

		const comment = comments.find((comment) => {
			return comment.id === id;
		});
		comment.status = status;

		/**
		 * @event CommentUpdated
		 * @description Emitted to the event bus upon the update to a comment's status
		 * @property type: CommentUpdated *string
		 * @property data.id: id *string
		 * @property: data.content: content *string
		 * @property data.postid: postid *string
		 * @property data.status: status *string
		 */
		await axios
			.post("http://localhost:4005/events", {
				type: "CommentUpdated",
				data: {
					id,
					content,
					postid,
					status,
				},
			})
			.catch((err) => {
				console.log(err.message);
			});
	}

	res.status("200").json({
		success: true,
	});
});

app.listen(4001, () => {
	console.log("Comments service started on port 4001");
});
