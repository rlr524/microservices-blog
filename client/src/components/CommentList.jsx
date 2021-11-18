import React from "react";

const CommentList = ({ comments }) => {
	const renderedComments = comments.map((comment) => {
		let statusMessage;

		switch (comment.status) {
			case "approved":
				statusMessage = comment.content;
				break;
			case "pending":
				statusMessage = "This comment is awaiting moderation";
				break;
			case "rejected":
				statusMessage = "This comment has been rejected";
				break;
			default:
				break;
		}
		return <li key={comment.id}>{statusMessage}</li>;
	});

	return <ul>{renderedComments}</ul>;
};

export default CommentList;
