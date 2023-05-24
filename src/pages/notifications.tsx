import React from "react";
import { Box, Text, Flex, ChakraProvider, Center } from "@chakra-ui/react";
import EventNotify from "@/components/Notifications/EventNotify";
import { FriendNotification } from "@/components/Notifications/FriendNotification";
import { useSession } from "next-auth/react";
import { useGetUserInfo, useGetUserProfile } from "@/queries/user.queries";
import { getAllEvent } from "@/queries/event.querues";
import Loader from "@/components/CustomComponents/Loader";
import { PostNotification } from "@/components/Notifications/PostNotification";

export default function notifications() {
  const { data: session } = useSession();

  const { isLoading: userIsLoading, data: userData } = useGetUserInfo(
    session?.accessToken,
    session?.user.id
  );
  const { data: events, status: eventStatus } = getAllEvent(
    session?.accessToken
  );
  const { isLoading: profileIsLoading, data: userProfile } = useGetUserProfile(
    session?.accessToken,
    session?.user.id
  );

  if (userIsLoading || profileIsLoading || eventStatus === "loading") {
    return <Loader />;
  }

  return (
    <ChakraProvider>
      <Flex
        display={"column"}
        maxBlockSize={"600px"}
        alignItems="center"
        justifyContent="center"
        bg={"#F5F2EA"}
      >
        <Flex
          mt="60px"
          justify="space-evenly"
          justifyContent="center"
          wrap="wrap"
          // gap="9"
        >
          <Box
            w="460px"
            overflowY="auto"
            maxHeight="450px"
            borderRadius={10}
            my={5}
            mx={[0, 5]}
            bg="#886E58"
            boxShadow={
              "0px 1px 25px -5px rgb(0 0 0 / 57%), 0 10px 10px -5px rgb(0 0 0 / 45%)"
            }
          >
            {/* event */}
            <Center mt="20px">
              <Text fontSize={"xl"} fontWeight="medium" color={"#ffffff"}>
                Events
              </Text>
            </Center>
            <Box h="400px" width="97%">
              {/* import event list here */}
              <EventNotify
                user={userData}
                event={events}
                session={session}
                userProfile={userProfile}
              />
            </Box>
          </Box>

          <Box
            w="460px"
            rounded="sm"
            borderRadius={10}
            my={5}
            mx={[0, 5]}
            overflowY="auto"
            bg="#886E58"
            boxShadow={
              "0px 1px 25px -5px rgb(0 0 0 / 57%), 0 10px 10px -5px rgb(0 0 0 / 45%)"
            }
          >
            {/* friends */}
            <Center mt="20px">
              <Text fontSize={"xl"} fontWeight="medium" color={"#ffffff"}>
                Friends
              </Text>
            </Center>
            <Box h="400px" width="100%">
              {/* import friend requests here */}
              <FriendNotification />
            </Box>
          </Box>

          {/* posts */}
          <Box
            w="460px"
            overflowY="auto"
            // maxHeight="450px"
            borderRadius={10}
            my={5}
            mx={[0, 5]}
            bg="#886E58"
            boxShadow={
              "0px 1px 25px -5px rgb(0 0 0 / 57%), 0 10px 10px -5px rgb(0 0 0 / 45%)"
            }
          >
            <Center mt="20px">
              <Text
                mb={"10px"}
                fontSize={"xl"}
                fontWeight="medium"
                color={"#ffffff"}
              >
                Posts
              </Text>
            </Center>
            <Box h="400px" width="97%">
              {/* import posts list here */}
              <PostNotification
                user={userData}
                userProfile={userProfile}
                session={session}
              />
            </Box>
          </Box>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}
