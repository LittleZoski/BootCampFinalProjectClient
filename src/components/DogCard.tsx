import { useGetDogProfile, useGetDogProfilePhoto } from "@/queries/dog.queries";
import { Dog } from "@/types/dog";
import {
  Flex,
  Box,
  Text,
  PopoverTrigger,
  Avatar,
  Popover,
  PopoverContent,
  PopoverBody,
  Grid,
  GridItem,
  HStack,
  Portal,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import CustomAvatar from "./CustomComponents/Avatar";
import { BsGenderFemale, BsGenderMale, BsDot } from "react-icons/bs";
import Loader from "./CustomComponents/Loader";
import { PuppyPalButton } from "./Friends/PuppyPalButton";
import { useRouter } from "next/router";

function DogAvatarSmall({ dog }: { dog: Dog }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { isLoading: dogPhotoIsLoading, data: dogPhoto } =
    useGetDogProfilePhoto(session?.accessToken, dog.id);

  const { isLoading: dogProfileIsLoading, data: dogProfile } = useGetDogProfile(
    session?.accessToken,
    dog.id
  );

  if (dogPhotoIsLoading || dogProfileIsLoading) {
    return <Loader />;
  }

  const genderIcon =
    dog.sex == "MALE" ? (
      <BsGenderMale color="blue" size={"28px"} />
    ) : (
      <BsGenderFemale color="pink" size={"28px"} />
    );

  const alteredStatus =
    dog.sex == "MALE" ? (
      dog.altered ? (
        <Text>Neutered</Text>
      ) : (
        <Text>Not Neutered</Text>
      )
    ) : dog.altered ? (
      <Text>Spayed</Text>
    ) : (
      <Text>Not Spayed</Text>
    );

  const gotoDog = (dogId: number) => {
    router.push({ pathname: `/dog-profile`, query: { myParam: dogId } });
  };

  return (
    <>
      <Popover trigger="hover">
        <PopoverTrigger>
          <Avatar
            onClick={() => gotoDog(dog.id)}
            src={`data:image/png;base64, ${dogPhoto}`}
            size={"md"}
          />
        </PopoverTrigger>
        <PopoverContent minW={"max-content"} backgroundColor={"#F5F2EA"}>
          <PopoverBody>
            <Grid
              h="250px"
              w={"400px"}
              templateRows="repeat(24, 1fr)"
              templateColumns="repeat(12, 1fr)"
              gap={1}
            >
              <GridItem rowSpan={18} colSpan={5}>
                <CustomAvatar
                  src={`data:image/png;base64, ${dogPhoto}`}
                  size={"175px"}
                  alt={`A picture of ${dog.name}`}
                />
              </GridItem>
              <GridItem rowSpan={4} colSpan={7}>
                <HStack>
                  {genderIcon}
                  <Text fontSize={"3xl"} as="b">
                    {dog.name}
                  </Text>
                </HStack>
              </GridItem>
              <GridItem rowSpan={2} colSpan={7} pl={2}>
                <Text as="b">{dog.breed}</Text>
              </GridItem>
              <GridItem rowSpan={3} colSpan={7} pl={2}>
                <HStack>
                  <Text as={"b"}>{dog.age}</Text> <BsDot size={"30px"} />{" "}
                  <Text as={"b"}>{alteredStatus}</Text>
                </HStack>
              </GridItem>
              <GridItem rowSpan={8} colSpan={7} pl={2}>
                {dogProfile.bio}
              </GridItem>
              <GridItem rowSpan={5} colSpan={12}>
                <PuppyPalButton />
              </GridItem>
            </Grid>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

function DogCardSmall({ dog }: { dog: Dog }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { isLoading: dogPhotoIsLoading, data: dogPhoto } =
    useGetDogProfilePhoto(session?.accessToken, dog.id);

  const { isLoading: dogProfileIsLoading, data: dogProfile } = useGetDogProfile(
    session?.accessToken,
    dog.id
  );

  if (dogPhotoIsLoading || dogProfileIsLoading) {
    return <Loader />;
  }

  const genderIcon =
    dog.sex == "MALE" ? (
      <BsGenderMale color="blue" size={"28px"} />
    ) : (
      <BsGenderFemale color="pink" size={"28px"} />
    );

  const alteredStatus =
    dog.sex == "MALE" ? (
      dog.altered ? (
        <Text>Neutered</Text>
      ) : (
        <Text>Not Neutered</Text>
      )
    ) : dog.altered ? (
      <Text>Spayed</Text>
    ) : (
      <Text>Not Spayed</Text>
    );

  const gotoDog = (dogId: number) => {
    router.push({ pathname: `/dog-profile`, query: { myParam: dogId } });
  };

  return (
    <Flex w="full">
      <Popover trigger="hover">
        <PopoverTrigger>
          <Box
            bg={"#886E58"}
            maxW="sm"
            borderWidth="1px"
            rounded="18px"
            shadow="lg"
            position="relative"
            textColor={"white"}
            alignContent={"center"}
          >
            <Box p={3} alignContent={"center"}>
              <Avatar
                onClick={() => gotoDog(dog.id)}
                src={`data:image/png;base64, ${dogPhoto}`}
                size={"2xl"}
                boxShadow={
                  "0px 1px 18px -5px rgb(0 0 0 / 57%), 0 10px 10px -5px rgb(0 0 0 / 45%)"
                }
              />

              <Text
                fontSize="2xl"
                fontWeight="bold"
                lineHeight="tight"
                pt={1}
                align={"center"}
              >
                {dog.name}
              </Text>
            </Box>
          </Box>
        </PopoverTrigger>
        <PopoverContent minW={"max-content"} backgroundColor={"#F5F2EA"}>
          <PopoverBody>
            <Grid
              h="250px"
              w={"400px"}
              templateRows="repeat(24, 1fr)"
              templateColumns="repeat(12, 1fr)"
              gap={1}
            >
              <GridItem
                rowSpan={18}
                colSpan={5}
                onClick={() => gotoDog(dog.id)}
              >
                <CustomAvatar
                  src={`data:image/png;base64, ${dogPhoto}`}
                  size={"175px"}
                  alt={`A picture of ${dog.name}`}
                />
              </GridItem>
              <GridItem rowSpan={4} colSpan={7}>
                <HStack>
                  {genderIcon}
                  <Text fontSize={"3xl"} as="b">
                    {dog.name}
                  </Text>
                </HStack>
              </GridItem>
              <GridItem rowSpan={2} colSpan={7} pl={2}>
                <Text as="b">{dog.breed}</Text>
              </GridItem>
              <GridItem rowSpan={3} colSpan={7} pl={2}>
                <HStack>
                  <Text as={"b"}>{dog.age}</Text> <BsDot size={"30px"} />{" "}
                  <Text as={"b"}>{alteredStatus}</Text>
                </HStack>
              </GridItem>
              <GridItem rowSpan={8} colSpan={7} pl={2}>
                {dogProfile.bio}
              </GridItem>
              <GridItem rowSpan={5} colSpan={12}>
                <PuppyPalButton />
              </GridItem>
            </Grid>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
}

function DogCardBig({ dog }: { dog: Dog }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { isLoading: dogPhotoIsLoading, data: dogPhoto } =
    useGetDogProfilePhoto(session?.accessToken, dog.id);

  const { isLoading: dogProfileIsLoading, data: dogProfile } = useGetDogProfile(
    session?.accessToken,
    dog.id
  );

  if (dogPhotoIsLoading || dogProfileIsLoading) {
    return <Loader />;
  }

  const genderIcon =
    dog.sex == "MALE" ? (
      <BsGenderMale color="blue" size={"28px"} />
    ) : (
      <BsGenderFemale color="pink" size={"28px"} />
    );

  const alteredStatus =
    dog.sex == "MALE" ? (
      dog.altered ? (
        <Text>Neutered</Text>
      ) : (
        <Text>Not Neutered</Text>
      )
    ) : dog.altered ? (
      <Text>Spayed</Text>
    ) : (
      <Text>Not Spayed</Text>
    );

  const gotoDog = (dogId: number) => {
    router.push({ pathname: `/dog-profile`, query: { myParam: dogId } });
  };

  return (
    <Flex w="full">
      <Box
        bg={"#886E58"}
        maxW="sm"
        borderWidth="1px"
        rounded="18px"
        shadow="lg"
        position="relative"
        textColor={"white"}
        alignContent={"center"}
      >
        <Box p={3} alignContent={"center"}>
          <Avatar
            onClick={() => gotoDog(dog.id)}
            src={`data:image/png;base64, ${dogPhoto}`}
            size={"4xl"}
            boxShadow={
              "0px 1px 18px -5px rgb(0 0 0 / 57%), 0 10px 10px -5px rgb(0 0 0 / 45%)"
            }
          />
        </Box>
      </Box>
    </Flex>
  );
}

export { DogCardSmall, DogAvatarSmall, DogCardBig };
