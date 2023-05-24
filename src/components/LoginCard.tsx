import React from "react";
import {
  Box,
  Stack,
  Heading,
  Text,
  Container,
  SimpleGrid,
  Highlight,
} from "@chakra-ui/react";

import { signIn } from "next-auth/react";
import LoginDogCarousel from "./LoginDogGallery";

function LoginCard() {
  return (
    <Box>
      <Container
        as={SimpleGrid}
        maxW={"5xl"}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Stack spacing={{ base: 10, md: 20 }}>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
          >
            Find Your Pups New Furry Friend{" "}
            <Text as={"span"} bgColor={"#886E58"} bgClip="text">
              &
            </Text>{" "}
            Connect With Fellow Dog Lovers
          </Heading>
          <Stack direction={"row"} spacing={4} align={"center"}></Stack>
        </Stack>
        <Stack
          bg={"gray.50"}
          rounded={"xl"}
          p={{ base: 3, sm: 4, md: 8, lg: 124 }}
          spacing={{ base: 6 }}
          maxW={{ lg: "lg" }}
        >
          <Stack spacing={4}>
            <Heading
              id="sign-in"
              color={"gray.800"}
              fontSize={"x-large"}
              textAlign={"center"}
            >
              Sign in to your account
            </Heading>
          </Stack>
          <Box as={"form"} mt={10}>
            <div className="container">
              <div className="button-container">
                <div className="dog">
                  <div className="tail"></div>
                  <div className="body"></div>
                  <div className="head">
                    <div className="eyes">
                      <div className="left"></div>
                      <div className="right"></div>
                    </div>
                    <div className="nuzzle">
                      <div className="mouth">
                        <div className="tongue"></div>
                      </div>
                      <div className="nose">
                        <div className="nostrils"></div>
                        <div className="highlight"></div>
                      </div>
                    </div>
                  </div>
                  <div className="ears">
                    <div className="left"></div>
                    <div className="right"></div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    signIn(null, { callbackUrl: "/home" });
                  }}
                >
                  Login/Register
                </button>
                <div className="paw"></div>
                <div className="paw top"></div>
              </div>
            </div>
          </Box>
        </Stack>
      </Container>
      <LoginDogCarousel />
    </Box>
  );
}

export default LoginCard;
