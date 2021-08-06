/**
 * @description The moderation service is used for comment moderation.
 */

const axios = require("axios");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
	const { type, data } = req.body;

	if (type === "CommentCreated") {
		const status = data.content.includes("orange")
			? "rejected"
			: "approved";

		/**
		 * @event CommentModerated
		 * @description Emitted to the event bus upon the manual or automated moderation of a comment and update of the comment's moderation status
		 * @property type: CommentModerated
		 * @property data.id: data.id
		 * @property data.postID: data.postID
		 * @property data.status: status
		 * @property data.content: data.content
		 */
		await axios
			.post("http://localhost:4005/events", {
				type: "CommentModerated",
				data: {
					id: data.id,
					postID: data.postID,
					status,
					content: data.content,
				},
			})
			.catch((err) => {
				console.log(err.message);
			});
	}
	res.status(201).json({
		success: true,
		id: data.id,
		status: data.status,
	});
});

app.listen(4003, () => {
	console.log("Moderation service started on port 4003");
});
