import React, { useState, useEffect } from "react";
import axios from "axios";
import CommentCreate from "../components/CommentCreate";
import CommentList from "../components/CommentList";

const PostList = () => {
	const [posts, setPosts] = useState({});

	const style = {
		width: "30%",
		marginBottom: "20px",
	};

	const fetchPosts = async () => {
		const res = await axios.get("http://localhost:4000/posts");

		setPosts(res.data);
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	const renderedPosts = Object.values(posts).map((post) => {
		return (
			<div className="card" style={style} key={post.id}>
				<div className="card-body">
					<h4>{post.title}</h4>
					<CommentList postId={post.id} />
					<CommentCreate postId={post.id} />
				</div>
			</div>
		);
	});

	return (
		<div className="d-flex flex-row flex-wrap justify-content-between">
			{renderedPosts}
		</div>
	);
};

export default PostList;
