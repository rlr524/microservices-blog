import React, { useState } from "react";
import axios from "axios";

const PostCreate = () => {
	const [title, setTitle] = useState("");

	const onSubmit = async (e) => {
		e.preventDefault();

		await axios.post("http://posts.com/posts/create", { title });

		setTitle("");
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<div className="form-group mb-4">
					<label className="mb-2">Title</label>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="form-control"
					/>
				</div>
				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	);
};

export default PostCreate;
