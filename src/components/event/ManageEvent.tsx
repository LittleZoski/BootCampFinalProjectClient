import { getAllEventHostedByCurrentUser } from "@/queries/event.querues";
import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import EventManagementCard from "./EventManagementCard";

function ManageEvent() {
  const { data: session } = useSession();
  const { eventStatus, eventData } = getAllEventHostedByCurrentUser(
    session?.accessToken
  );
  const [isLargerThan950] = useMediaQuery("(min-width: 950px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });
  if (eventStatus === "loading") {
    return <>is loading</>;
  }

  if (eventStatus === "error") {
    return <>error calling apis</>;
  }
  return (
    <Box>
      {isLargerThan950 ? (
        <Flex flexDirection={"column"} mt={"1em"} width="60vw">
          {eventData.map((event) => (
            <EventManagementCard event={event} key={event.eventId} />
          ))}
        </Flex>
      ) : (
        <Flex flexDirection={"column"}  >
          {eventData.map((event) => (
            <EventManagementCard event={event} key={event.eventId} />
          ))}
        </Flex>
      )}
    </Box>
  );
}

export default ManageEvent;
