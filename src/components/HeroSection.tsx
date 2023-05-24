import {
  Button,
  Center,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import Carousel from "./Carousel";

export default function HeroSection() {
  return (
    <Stack
      className="top"
      minH={"50vh"}
      direction={{ base: "column", md: "row" }}
      bg={"#F5F2EA"}
    >
      <Flex p={8} flex={2} align={"center"} justify={"center"}>
        <Stack spacing={6} w={"full"} maxW={"lg"}>
          <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
            <Heading
              color={"#886E58"}
              fontWeight={"extrabold"}
              id="whistl"
              fontSize={"100px"}
            >
              <h1 className="Hero">Whistl</h1>
            </Heading>
            <Text
              color={"#886E58"}
              as={"span"}
              fontFamily={"Poppins"}
              fontSize={"33.33333333px"}
            >
              Your dog's best friend
            </Text>{" "}
          </Heading>
          <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
            Our Mission: Help your dog keep track of all their doggy friends!
          </Text>
          <Stack direction={{ base: "column", md: "row" }} spacing={4}>
            <Button
              rounded={"full"}
              bg={"#886E58"}
              color={"white"}
              _hover={{
                bg: "#886E58",
              }}
            >
              <Link href="/create">Create Pup Profile</Link>
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Center>
          <Carousel
          />
        </Center>
      </Flex>
    </Stack>
  );
}
