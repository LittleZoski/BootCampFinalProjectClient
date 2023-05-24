import { useGetDogOwnersByDogId } from "@/queries/dog.queries";
import { DogProfile } from "@/types/dog-profile";
import {
	Flex,
	VStack,
	Text,
	SimpleGrid,
	GridItem,
	useBreakpointValue,
	Heading,
	Spinner,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import DogProfilePhoto from "./DogProfilePhoto";
import EditButton from "./EditButton";

function DogOverView({
	dogProfile,
	session,
}: {
	dogProfile: DogProfile;
	session: Session;
}) {
	const buttonSpacer = useBreakpointValue({ base: 1, md: "60px" });
	const { status, data: dogOwners } = useGetDogOwnersByDogId(
		session.accessToken,
		dogProfile.dog.id
	);

	if (status === "loading") {
		return <Spinner />;
	}

	if (status === "success") {
		return (
			<>
				<Flex
					h={{ base: "auto" }}
					py={5}
					direction={{ base: "column", md: "row" }}
				>
					<DogProfilePhoto
						id={dogProfile.profilePhotoId}
						accessToken={session?.accessToken}
					/>
					<VStack>
						<SimpleGrid
							columns={3}
							columnGap={3}
							rowGap={4}
							w={"full"}
							pt={3}
							pl={3}
							ml={1}
						>
							<GridItem colSpan={3} marginTop={"30px"}>
								<Heading size={"md"}>{dogProfile.dog.name}</Heading>
							</GridItem>
							<GridItem colSpan={1}>
								<Heading color={"#886E58"} size={"sm"}>
									{dogProfile.dog.breed}
								</Heading>
							</GridItem>
						</SimpleGrid>
					</VStack>
					<VStack marginLeft={"auto"}>
						<SimpleGrid
							columns={2}
							columnGap={3}
							rowGap={buttonSpacer}
							w={"full"}
							pt={3}
							pl={3}
						>
							{session?.user.id === dogOwners?.[0].userId ? (
								<GridItem>
									<EditButton
										dogProfile={dogProfile}
										accessToken={session?.accessToken}
									/>
								</GridItem>
							) : null}
						</SimpleGrid>
					</VStack>
				</Flex>
			</>
		);
	}
}

export default DogOverView;
