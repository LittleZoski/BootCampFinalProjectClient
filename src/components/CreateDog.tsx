import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	HStack,
	Stack,
	Button,
	Heading,
	useColorModeValue,
	RadioGroup,
	Radio,
	CheckboxGroup,
	Checkbox,
	Textarea,
	Select,
	Grid,
	GridItem,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";
import React from "react";
import { Dog, Sex } from "@/types/dog";
import {
	useCreateDog,
	useCreateProfile,
	useUploadDogPhoto,
} from "@/queries/dog.queries";
import { useSession } from "next-auth/react";

import ImageUploadComponent from "./ImageHandling/ImageUploadComponent";
import BreedSelect from "./BreedSelect";
import { useRouter } from "next/router";
import { DogProfile } from "@/types/dog-profile";

function SignupCard() {
	const { data: session } = useSession();
	const createDogMutation = useCreateDog(session?.accessToken);
	const [size, setSize] = useState<Dog["size"] | null>(null);
	const [altered, setAltered] = useState<Dog["altered"]>(null);
	const [weight, setWeight] = useState<Dog["weightLbs"]>(null);
	const [sex, setSex] = useState<Dog["sex"] | null>(null);
	const [breed, setBreed] = useState<Dog["breed"]>(null);
	const [breedId, setBreedId] = useState<Dog["breedId"]>(null);
	const [age, setAge] = useState<Dog["age"]>(null);
	const [name, setName] = useState<Dog["name"]>(null);
	const [temperament, setTemperament] =
		useState<DogProfile["temperament"]>(null);
	const [dogId, setDogId] = useState<Dog["id"]>(null);
	const [profilePhotoId, setProfilePhotoId] =
		useState<DogProfile["profilePhotoId"]>(null);
	const [bio, setBio] = useState<DogProfile["bio"]>(null);
	const [tricks, setTricks] = useState([]);
	const [error, setError] = useState(false);

	const uploadPhotoMutation = useUploadDogPhoto(session?.accessToken);
	const createDogProfileMutation = useCreateProfile(session?.accessToken);
	const [selectedFile, setSelectedFile] = useState(null);
	const router = useRouter();

	const handleFileSelect = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	function handleChange(event) {
		setBreedId(event.value.id);
		setBreed(event.value.name);
	}

	async function handleClick() {
		setError(false);
		const dog: Dog = {
			id: dogId,
			size,
			altered,
			weightLbs: weight,
			sex,
			breed,
			breedId,
			age,
			name,
			tricks,
		};

		const profile: DogProfile = {
			profilePhotoId,
			dog: dog,
			temperament,
			bio,
		};

		if (
			dog.size === null ||
			dog.altered === null ||
			dog.weightLbs === null ||
			dog.sex === null ||
			dog.breed === null ||
			dog.breedId === null ||
			dog.age === null ||
			dog.name === null ||
			dog.tricks === null ||
			profile.temperament === null ||
			profile.bio === null ||
			selectedFile === null
		) {
			setError(true);
		} else {
			try {
				const createDogResponse = await createDogMutation.mutateAsync(dog);
				const dogId = createDogResponse.data.id;
				dog.id = dogId;
				const photoResponse = await uploadPhotoMutation.mutateAsync({
					dogId,
					file: selectedFile,
				});
				const profilePhotoId = await photoResponse.data;
				profile.profilePhotoId = profilePhotoId;
				const createProfileResponse =
					await createDogProfileMutation.mutateAsync(profile);

				router.push({
					pathname: `/dog-profile`,
					query: { myParam: JSON.stringify(dogId) },
				});
			} catch {}
		}
	}

	return (
		<Flex
			id="backdrop"
			minH={"100vh"}
			align={"center"}
			justify={"center"}
			backgroundColor={"#F5F2EA"}
		>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"} color={"#886E58"}>
						Create Dog
					</Heading>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					boxShadow={"lg"}
					p={8}
				>
					<Stack spacing={4}>
						<HStack>
							<Box>
								<FormControl id="firstName" isRequired>
									<FormLabel color={"#886E58"}>Name</FormLabel>
									<Input
										type="text"
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											setName(event.target.value);
										}}
									/>
								</FormControl>
							</Box>
							<Box>
								<FormControl p={4} isRequired>
									<FormLabel color={"#886E58"}>Breed</FormLabel>
									<BreedSelect
										handleChange={handleChange}
										breedSelection={""}
									/>
								</FormControl>
							</Box>
						</HStack>
						<HStack>
							<Box>
								<FormControl id="age" isRequired>
									<FormLabel color={"#886E58"}>Age</FormLabel>
									<Input
										type="number"
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											setAge(event.target.valueAsNumber);
										}}
									/>
								</FormControl>
							</Box>
							<Box>
								<FormControl id="weight" isRequired>
									<FormLabel color={"#886E58"}>Weight</FormLabel>
									<Input
										type="number"
										onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
											setWeight(event.target.valueAsNumber);
										}}
									/>
								</FormControl>
							</Box>
						</HStack>
						<HStack>
							<Box>
								<FormControl id="size" isRequired>
									<FormLabel color={"#886E58"}>Size</FormLabel>
									<Select
										placeholder="Select option"
										onChange={(event) => {
											setSize(event.target.value as Dog["size"]);
										}}
									>
										<option value="TEACUP">Teacup</option>
										<option value="SMALL">Small</option>
										<option value="MEDIUM">Medium</option>
										<option value="LARGE">Large</option>
										<option value="X_LARGE">X-Large</option>
									</Select>
								</FormControl>
							</Box>
							<Box>
								<FormControl id="size" isRequired>
									<FormLabel color={"#886E58"}>Altered</FormLabel>
									<RadioGroup
										onChange={(value) => {
											const newAltered = value === "true" ? true : false;
											setAltered(newAltered);
										}}
									>
										<Stack direction="row">
											<Radio value="true">Yes</Radio>
											<Radio value="false">No</Radio>
										</Stack>
									</RadioGroup>
								</FormControl>
							</Box>
							<Box>
								<FormControl id="size" isRequired>
									<FormLabel color={"#886E58"}>Sex</FormLabel>
									<RadioGroup
										onChange={(value) => {
											const newSex = value === "M" ? Sex.MALE : Sex.FEMALE;
											setSex(newSex);
										}}
									>
										<Stack direction="row">
											<Radio value="M">M</Radio>
											<Radio value="F">F</Radio>
										</Stack>
									</RadioGroup>
								</FormControl>
							</Box>
						</HStack>

						<Stack align={"center"}>
							<Heading fontSize={"4xl"} textAlign={"center"} color={"#886E58"}>
								Tricks Known
							</Heading>
						</Stack>
						<Box pt={6} pb={2}>
							<CheckboxGroup
								colorScheme="yellow"
								defaultValue={[]}
								onChange={(e) => {
									setTricks(e);
								}}
							>
								<Grid templateColumns="repeat(2, 1fr)" gap={2}>
									<GridItem w="100%" h="8">
										<Checkbox value="Fetch">Fetch</Checkbox>
									</GridItem>
									<GridItem w="100%" h="10">
										<Checkbox value="Kiss">Kiss</Checkbox>
									</GridItem>
									<GridItem w="100%" h="10">
										<Checkbox value="Speak">Speak</Checkbox>
									</GridItem>
									<GridItem w="100%" h="10">
										<Checkbox value="Roll over">Roll over</Checkbox>
									</GridItem>
									<GridItem w="100%" h="10">
										<Checkbox value="Play dead">Play dead</Checkbox>
									</GridItem>
									<GridItem w="100%" h="10">
										<Checkbox value="Hug">Hug</Checkbox>
									</GridItem>
									<GridItem w="100%" h="10">
										<Checkbox value="Spin">Spin</Checkbox>
									</GridItem>
									<GridItem w="100%" h="10">
										<Checkbox value="Shake hands">Shake hands</Checkbox>
									</GridItem>
								</Grid>
							</CheckboxGroup>
							<Box>
								<Heading
									fontSize={"2xl"}
									color={"#886E58"}
									textAlign={"center"}
									mb="5%"
									mt="5%"
								>
									Temperament:
								</Heading>
								<FormControl id="temperament" isRequired>
									<Textarea
										placeholder="What is your dogs temper?"
										onChange={(
											event: React.ChangeEvent<HTMLTextAreaElement>
										) => {
											setTemperament(event.target.value);
										}}
									/>
								</FormControl>
							</Box>
							<Box>
								<Heading
									fontSize={"2xl"}
									color={"#886E58"}
									textAlign={"center"}
									mb="5%"
									mt="5%"
								>
									Bio:
								</Heading>
								<FormControl id="likes" isRequired>
									<Textarea
										placeholder="Tell us about your pup"
										onChange={(
											event: React.ChangeEvent<HTMLTextAreaElement>
										) => {
											setBio(event.target.value);
										}}
									/>
								</FormControl>
							</Box>
						</Box>
						<ImageUploadComponent handleFileSelect={handleFileSelect} />
						<Stack spacing={10} pt={2}>
							<Button
								loadingText="Submitting"
								size="lg"
								bg={"#886E58"}
								color={"white"}
								_hover={{
									bg: "#735238",
								}}
								onClick={handleClick}
							>
								Create Dog
							</Button>
							{error ? (
								<Text textAlign={"center"} color={"red"}>
									Please fill out all fields
								</Text>
							) : null}
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}

export default SignupCard;
