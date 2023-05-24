import { Box, Button, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import React from "react";
import { useSession } from "next-auth/react";
import { useCreatePost } from "@/queries/post.queries";
import { Post } from "@/types/post";
import { FaPaw } from "react-icons/fa";
import { useGetFriendList } from "@/queries/friend.queries";
import { useQueryClient } from "@tanstack/react-query";

function CreatePostForm({ accessToken }) {
	const queryClient = useQueryClient();
	const userFriends = useGetFriendList(accessToken, "2");
	const createPostMutation = useCreatePost(accessToken);
	const [message, setMessage] = useState<Post["message"] | null>(null);
	const [searchTerm, setSearchTerm] = useState<string | null>(null);
	const [isTagging, setIsTagging] = useState<boolean>(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (searchTerm) {
			console.log(searchTerm);
		}
	}, [searchTerm]);

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.target.value as Post["message"];
		setMessage(value);

		if (value.charAt(value.length - 1) === "@") {
			// if the last character is '@', set the searchTerm state to be empty and setIsTagging to true
			setSearchTerm("");
			setIsTagging(true);
		} else if (isTagging) {
			if (value.charAt(value.length - 1) === " ") {
				// if the last character is ' ', set the setIsTagging to false
				setIsTagging(false);
			} else {
				// if isTagging is true, append the new character to searchTerm
				setSearchTerm(
					(prevSearchTerm) => prevSearchTerm + value.charAt(value.length - 1)
				);
			}
		}
	};

	useEffect(() => {
		if (createPostMutation.isSuccess) {
			setMessage("");
			queryClient.invalidateQueries();
		}
		setLoading(false);
	}, [createPostMutation.isSuccess]);

	async function handleSubmit() {
		const post: Post = {
			message,
		};
		createPostMutation.mutate(post);
		setLoading(true);
	}

	return (
		<Box mx="auto">
			<form>
				<Textarea
					onChange={(event) => {
						handleChange(event);
					}}
					maxWidth={"400px"}
					focusBorderColor="#886E58"
					borderRadius={"20px"}
					borderColor={"#978576"}
					borderWidth={"3px"}
					placeholder="What's on your mind..."
					value={message}
				/>

				<Button
					className="button-74"
					onClick={handleSubmit}
					isLoading={loading}
				>
					<div id="paw">
						<FaPaw />
					</div>
					<div className="post">Post</div>
				</Button>
			</form>
		</Box>
	);
}

export default CreatePostForm;
