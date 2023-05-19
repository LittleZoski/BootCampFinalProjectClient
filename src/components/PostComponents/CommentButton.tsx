import { FaRegCommentAlt } from "react-icons/fa";

import {
	Button,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	Text,
	HStack,
	Box,
	Container,
	Textarea,
	Spinner,
} from "@chakra-ui/react";
import PostComponent from "./PostComponent";
import { User, UserProfile } from "@/types/user";
import { Post } from "@/types/post";
import UserPostProfilePhoto from "./UserPostProfilePhoto";
import LikeButton from "./LikeButton";
import { useAddComment, useGetPostsByCommentId } from "@/queries/post.queries";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CommentComponent from "./CommentComponent";
import CommentSection from "./CommentSection";

function CommentButton({
	user,
	post,
	accessToken,
	userProfile,
}: {
	user: User;
	post: Post;
	accessToken: string;
	userProfile: UserProfile;
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const addComment = useAddComment(accessToken);
	const [message, setMessage] = useState(null);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (addComment.isSuccess) {
			setMessage("");
			queryClient.invalidateQueries();
		}
	}, [addComment.isSuccess]);

	function handleComment() {
		const postId = post.postId;
		const comment: Post = {
			message,
		};
		const value = { postId, comment };
		addComment.mutate(value);
	}

	return (
		<>
			<button className="comment-button" onClick={onOpen}>
				<div className="container" id="comment-icon">
					<span className="comment-alt">
						<FaRegCommentAlt />
					</span>
					<span className="text">Comment</span>
				</div>
			</button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size={"lg"}
				scrollBehavior={"inside"}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader alignItems={"center"}>
						{user.displayName}'s Post
					</ModalHeader>
					<Box
						borderColor={"#978576"}
						borderWidth={"1px"}
						borderRadius={"10px"}
						marginRight={2}
						marginLeft={2}
					>
						<HStack marginLeft={2}>
							<UserPostProfilePhoto
								photoId={userProfile.profilePhotoId}
								accessToken={accessToken}
							/>
							<Heading marginTop={3} size={"sm"}>
								{user.displayName}
							</Heading>
							<Text>time</Text>
						</HStack>

						<Text
							paddingTop={1}
							paddingLeft={2}
							paddingRight={2}
							textAlign="center"
						>
							{post.message}
						</Text>
						<HStack alignSelf={"center"}>
							<LikeButton post={post} user={user} accessToken={accessToken} />
							<button className="comment-button" onClick={onOpen}>
								<div className="container" id="comment-icon">
									<span className="comment-alt">
										<FaRegCommentAlt />
									</span>
									<span className="text">Comment</span>
								</div>
							</button>
						</HStack>
					</Box>

					<ModalCloseButton />
					<ModalBody>
						<CommentSection accessToken={accessToken} post={post} />
					</ModalBody>

					<ModalFooter>
						<Textarea
							placeholder="Write a comment"
							borderColor={"#978576"}
							borderWidth={"1px"}
							value={message}
							onChange={(e) => {
								setMessage(e.target.value);
							}}
						></Textarea>
						<Button onClick={handleComment}>Submit</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default CommentButton;
