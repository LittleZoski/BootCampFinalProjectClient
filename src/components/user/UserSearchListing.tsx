import { useGetUserProfile } from "@/queries/user.queries";
import { User } from "@/types/user";
import { Heading, Box, Text, Button, Spinner, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import UserPostProfilePhoto from "../PostComponents/UserPostProfilePhoto";

function UserSearchListing({
	accessToken,
	user,
}: {
	accessToken: string;
	user: User;
}) {
	const getProfile = useGetUserProfile(accessToken, user.id);
	const router = useRouter();

	function handleClick() {
		router.push({
			pathname: `/user-profile`,
			query: { myParam: JSON.stringify(user.id) },
		});
	}

	if (getProfile.status === "loading") {
		return <Spinner />;
	}

	if (getProfile.status === "success") {
		return (
			<>
				<HStack>
					<UserPostProfilePhoto
						accessToken={accessToken}
						photoId={getProfile.data.profilePhotoId}
					/>
					<Box>
						<Heading size="xs" textTransform="uppercase" color="#886E58">
							{user.displayName}
						</Heading>
						<Text color={"#4A5568"} onClick={handleClick} pt="2" fontSize="sm">
							See profile
						</Text>
					</Box>
				</HStack>
			</>
		);
	}
}

export default UserSearchListing;
