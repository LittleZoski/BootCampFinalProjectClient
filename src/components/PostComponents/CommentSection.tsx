import { User, UserProfile } from "@/types/user";
import { Post } from "@/types/post";
import UserPostProfilePhoto from "./UserPostProfilePhoto";
import LikeButton from "./LikeButton";
import { useAddComment, useGetPostsByCommentId } from "@/queries/post.queries";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CommentComponent from "./CommentComponent";
import { Spinner, Text } from "@chakra-ui/react";

function CommentSection({
	accessToken,
	post,
}: {
	accessToken: string;
	post: Post;
}) {
	const getComments = useGetPostsByCommentId(accessToken, post.postId);
	if (getComments.status === "loading") {
		return <Spinner />;
	}
	if (getComments.status === "success") {
		const comments = getComments.data;
		return (
			<>
				{comments.length === 0 ? (
					<Text>No comments yet</Text>
				) : (
					comments.map((comment) => (
						<CommentComponent accessToken={accessToken} post={comment} />
					))
				)}
			</>
		);
	}
}

export default CommentSection;
