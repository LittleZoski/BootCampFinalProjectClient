import { useGetDogOwnersByDogId } from "@/queries/dog.queries";
import { DogProfile } from "@/types/dog-profile";
import { Flex, Button, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";

function UserShortcutBar({
	dogProfile,
	accessToken,
}: {
	dogProfile: DogProfile;
	accessToken: string;
}) {
	const router = useRouter();
	const { status, data: dogOwners } = useGetDogOwnersByDogId(
		accessToken,
		dogProfile.dog.id
	);

	if (status === "loading") {
		return <Spinner />;
	}

	if (status === "success") {
		return (
			<>
				<Flex w={"full"}>
					<Button
						onClick={() => {
							router.push({
								pathname: `/user-profile`,
								query: {
									myParam: JSON.stringify(dogOwners?.[0].userId),
								},
							});
						}}
					>
						Owner
					</Button>
					<Button>Friends</Button>
					<Button
						onClick={() => {
							router.push({
								pathname: `/events`,
							});
						}}
					>
						Events
					</Button>
				</Flex>
			</>
		);
	}
}

export default UserShortcutBar;
