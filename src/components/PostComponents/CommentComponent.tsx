import { Post } from "@/types/post";
import { UserProfile } from "@/types/user";
import { Card, Heading, HStack, VStack, Text, Spinner } from "@chakra-ui/react";
import { User } from "@/types/user";
import UserPostProfilePhoto from "./UserPostProfilePhoto";
import LikeButton from "./LikeButton";
import { useGetUserById, useGetUserProfile } from "@/queries/user.queries";
import { toDate, formatDistanceToNow, intlFormatDistance } from "date-fns";

function CommentComponent({
	accessToken,

	post,
}: {
	accessToken: string;

	post: Post;
}) {
	const getAuthorInfo = useGetUserById(accessToken, post.authorId);
	const getProfile = useGetUserProfile(accessToken, post.authorId);

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
			<Card
				size="lg"
				width={"md"}
				alignSelf="center"
				paddingTop={2}
				paddingBottom={2}
			>
				<HStack marginLeft={2}>
					<UserPostProfilePhoto
						photoId={userProfile.profilePhotoId}
						accessToken={accessToken}
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

				<HStack alignSelf={"center"} paddingTop={7}>
					<LikeButton post={post} user={author} accessToken={accessToken} />
				</HStack>
			</Card>
		);
	}
}

export default CommentComponent;
