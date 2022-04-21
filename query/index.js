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

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

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
			.get("http://event-bus-srv:4005/events")
			.catch((err) => console.log(err.message));

		for (let event of res.data) {
			console.log(
				`Processing event: ${event.type} at ${
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
				}`
			);
			handleEvent(event.type, event.data);
		}
	} catch (error) {
		console.log(error.message);
	}
});
