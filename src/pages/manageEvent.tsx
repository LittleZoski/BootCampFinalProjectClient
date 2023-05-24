import EventManagementCard from "@/components/event/EventManagementCard";
import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

function manageEvent() {
  const router = useRouter();

  if (router.query.myParam !== undefined) {
    const myEvent = JSON.parse(router.query.myParam as string);
    return (
      <Flex
        w="60%"
        mb="5"
        ml={"20%"}
        fontFamily={"font-family: Arial, sans-serif;"}
        justifyContent="center"
        alignItems={"center"}
      >
        <EventManagementCard event={myEvent} />
      </Flex>
    );
  }
}

export default manageEvent;
