import { useState } from "react";
import {
	Avatar,
	Box,
	Card,
	Center,
	Container,
	Flex,
	Heading,
	HStack,
	Spinner,
	Text,
	useBreakpointValue,
	VStack,
} from "@chakra-ui/react";
import { Post } from "@/types/post";
import UserPostProfilePhoto from "./UserPostProfilePhoto";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import { useGetUserById, useGetUserProfile } from "@/queries/user.queries";
import { Session } from "next-auth";
import { toDate, formatDistanceToNow, intlFormatDistance } from "date-fns";
import Loader from "../CustomComponents/Loader";

function Post({ session, post }: { session: Session; post: Post }) {
	const getAuthorInfo = useGetUserById(session?.accessToken, post.authorId);
	const getProfile = useGetUserProfile(session?.accessToken, post.authorId);
	const postWidth = useBreakpointValue({
		base: "250px",
		md: "400px",
	});
	const margin = useBreakpointValue({
		base: "0",
		md: "9",
	});

	function getDate() {
		const date = toDate(post.dateTime);
		const distance = intlFormatDistance(date, new Date());
		return distance;
	}

	if (getProfile.status === "loading") {
		return <Spinner />;
	}
	if (getAuthorInfo.status === "loading") {
		return <Spinner />;
	}
	if (getProfile.status === "success" && getAuthorInfo.status === "success") {
		const userProfile = getProfile.data;
		const author = getAuthorInfo.data;

		return (
			<Box
				width={postWidth}
				mx="auto"
				paddingTop={2}
				paddingBottom={2}
				borderRadius={"20px"}
				borderColor={"#978576"}
				borderWidth={"3px"}
			>
				<HStack marginLeft={2}>
					<UserPostProfilePhoto
						photoId={userProfile.profilePhotoId}
						accessToken={session?.accessToken}
					/>

					<Heading marginTop={3} size={"sm"}>
						{author.displayName}
					</Heading>
					<Text>{getDate()}</Text>
				</HStack>

				<Text
					paddingTop={1}
					paddingLeft={2}
					paddingRight={2}
					textAlign="center"
				>
					{post.message}
				</Text>
				<Container marginLeft={margin}>
					<HStack alignItems={"center"} paddingTop={7}>
						{post.authorId === session?.user.id ? null : (
							<LikeButton
								post={post}
								user={author}
								accessToken={session?.accessToken}
							/>
						)}
						<CommentButton
							post={post}
							user={author}
							accessToken={session?.accessToken}
							userProfile={userProfile}
						/>
					</HStack>
				</Container>
			</Box>
		);
	}
}

interface PostNotificationCardProps {
	post: Post;
	session: Session;
}

export const PostNotificationCard: React.FC<PostNotificationCardProps> = ({
	post,
	session,
}) => {
	const getAuthorInfo = useGetUserById(session?.accessToken, post.authorId);
	const getProfile = useGetUserProfile(session?.accessToken, post.authorId);

	if (getProfile.status === "loading") {
		return <Loader />;
	}
	if (getAuthorInfo.status === "loading") {
		return <Loader />;
	}
	if (getProfile.status === "success" && getAuthorInfo.status === "success") {
		const userProfile = getProfile.data;
		const author = getAuthorInfo.data;
		return (
			<Flex justifyContent={"center"}>
				<Flex
					w={"96%"}
					bg="#F5F2EA"
					mr="3"
					pt="3"
					ml="6"
					borderRadius="20px"
					alignSelf="center"
					paddingBottom={2}
				>
					<Box marginLeft={2}>
						<UserPostProfilePhoto
							photoId={userProfile.profilePhotoId}
							accessToken={session?.accessToken}
						/>
						<Box m={0.5}>
							<Heading marginTop={3} size={"sm"}>
								{author.displayName}
							</Heading>
							{/* <Text>time</Text> */}
						</Box>
					</Box>

					<Text
						paddingTop={1}
						paddingLeft={2}
						paddingRight={2}
						textAlign="left"
					>
						{post.message}
					</Text>

					<Box alignSelf={"center"} paddingTop={7}>
						{post.authorId === session?.user.id ? null : (
							<LikeButton
								post={post}
								user={author}
								accessToken={session?.accessToken}
							/>
						)}
						<Flex alignItems={"left"} m={"6"} bg="#F5F2EA">
							<CommentButton
								post={post}
								user={author}
								accessToken={session?.accessToken}
								userProfile={userProfile}
							/>
						</Flex>
					</Box>
				</Flex>
			</Flex>
		);
	}
};

export default Post;
