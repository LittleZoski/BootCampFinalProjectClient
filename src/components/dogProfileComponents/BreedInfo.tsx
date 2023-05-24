import { useGetBreedInfo } from "@/queries/dog.queries";
import { Dog } from "@/types/dog";
import { Box, Heading, HStack, Spinner, Text } from "@chakra-ui/react";

function BreedInfo({ dog, accessToken }: { dog: Dog; accessToken: string }) {
	const { status, data: breedInfo } = useGetBreedInfo(accessToken, dog.breedId);

	if (status === "loading") {
		return <Spinner></Spinner>;
	}

	if (status === "success") {
		return (
			<>
				<Box
					pt={"20px"}
					pb={"20px"}
					pl={"20px"}
					rounded="10px"
					w={"full"}
					css={{
						border: "1px solid #886E58",
						backgroundColor: "white",
					}}
					boxShadow={
						"0px 1px 10px -5px rgb(0 0 0 / 57%), 0 10px 10px -5px rgb(0 0 0 / 45%)"
					}
				>
					<Heading color={"#886E58"} fontSize={"xl"}>
						{breedInfo.name.charAt(0).toUpperCase() + breedInfo.name.slice(1)}
					</Heading>
					{breedInfo.breed_group != null && breedInfo.breed_group != "" ? (
						<Text>Breed group: {breedInfo.breed_group}</Text>
					) : null}
					{breedInfo.temperament != null && breedInfo.temperament != "" ? (
						<Text>Personality: {breedInfo.temperament}</Text>
					) : null}
					{breedInfo.height.imperial != null &&
					breedInfo.height.imperial != "" ? (
						<Text>Average height: {breedInfo.height.imperial} inches</Text>
					) : null}
					{breedInfo.weight.imperial != null &&
					breedInfo.weight.imperial! + "" ? (
						<Text>Average weight: {breedInfo.weight.imperial} lbs</Text>
					) : null}
					{breedInfo.bred_for != null && breedInfo.bred_for != "" ? (
						<Text>
							Orignially bred for: {breedInfo.bred_for.toLowerCase()}{" "}
						</Text>
					) : null}
					{breedInfo.origin != null && breedInfo.origin != "" ? (
						<Text>Origin: {breedInfo.origin}</Text>
					) : null}
					{breedInfo.life_span != null && breedInfo.life_span != "" ? (
						<Text>Average lifespan: {breedInfo.life_span}</Text>
					) : null}
				</Box>
			</>
		);
	}
}
export default BreedInfo;
