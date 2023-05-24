import React, { Fragment, useEffect, useState } from "react";
import { Box, Grid, GridItem, Flex, Button, Stack } from "@chakra-ui/react";
import { Event } from "@/types/event";
import { AddIcon, CheckCircleIcon, StarIcon } from "@chakra-ui/icons";
import { useSession } from "next-auth/react";
import { getUserById } from "@/queries/user.queries";
import Media from "react-media";
import {
  userAcceptEventInvite,
  userApplyToUninvitedEvent,
} from "@/queries/event.querues";
import { getUserEventDto } from "@/queries/userEventDTO.queries";
import { useRouter } from "next/router";
import { UserProfilePhotoSmall } from "../UserPage/UserProfilePhoto";
import Loader from "../CustomComponents/Loader";

function EventCard({ event }: { event: Event }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { status, data } = getUserById(session?.accessToken, event.hostId);
  const userAcceptInvite = userAcceptEventInvite(session?.accessToken);
  const userApplyForEvent = userApplyToUninvitedEvent(session?.accessToken);
  const { DTOstatus, DTOdata } = getUserEventDto(
    session?.accessToken,
    session.user.id,
    event.eventId
  );

  function onAccept() {
    userAcceptInvite.mutate(event.eventId);
  }

  function onApply() {
    userApplyForEvent.mutate(event.eventId);
  }

  function onChatClick(e) {
    e.preventDefault();
    router.push(`/event/${event.eventId}/chat`);
  }

  function onManage() {
    router.push({
      pathname: "/manageEvent",
      query: { myParam: JSON.stringify(event) },
    });
  }

  if (status == "loading") {
    return <Loader />;
  }

  return (
    <Box
      w="80%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={"#886E58"}
      mb="5"
      fontFamily={"font-family: Arial, sans-serif;"}
    >
      <Media
        queries={{ small: "(max-width:950px)", medium: "(min-width:950px)" }}
      >
        {(matches) => (
          <Fragment>
            {matches.medium && (
              <Grid
                templateAreas={`"nav header time"
                  "nav main footer"
                  "nav main footer"`}
                gridTemplateRows={"1fr 2fr"}
                gridTemplateColumns={"1.5fr 5fr 3fr"}
                h="225px"
                gap="1"
                color="blackAlpha.700"
                fontWeight="bold"
                justifyContent="center"
                alignItems="center"
              >
                <GridItem pl="1em" area={"header"} color="white">
                  <Flex ml="3em">{event.eventTitle}</Flex>
                </GridItem>
                <GridItem area={"nav"} color="white">
                  <Flex mb="1em" ml="2em">
                    {status == "error"
                      ? "User Not Exist"
                      : status == "loading"
                      ? "loading user information"
                      : data.fullName}
                  </Flex>
                  <Flex mb="1em" ml="2em">
                    <UserProfilePhotoSmall userId={data.id} />
                  </Flex>
                </GridItem>
                <GridItem pl="1em" area={"main"} color="white">
                  <Flex ml="3em" flexDirection="column">
                    <Flex>{event.eventDescription} </Flex>
                    <Flex>Where: {event.eventLocation}</Flex>
                    <Flex>When: {event.date} {event.time}</Flex>
                  </Flex>
                </GridItem>
                <GridItem pl="1em" area={"footer"} color="white">
                  <Stack direction="column" spacing={3} justify="center">
                    <Flex justify={"center"}>
                      <Button
                        colorScheme="milk"
                        size="md"
                        variant="outline"
                        onClick={onChatClick}
                      >
                        Live Chat
                      </Button>
                    </Flex>
                    <Flex justify={"center"}>
                      {DTOdata ? null : (
                        <Button
                          colorScheme="milk"
                          size="md"
                          variant="outline"
                          leftIcon={<AddIcon />}
                          onClick={onApply}
                        >
                          Apply Event
                        </Button>
                      )}
                    </Flex>
                    <Flex justify={"center"}>
                      {DTOdata ? (
                        DTOdata.eventInvitedStatus.toLowerCase() ===
                          "invited" &&
                        DTOdata.eventAccessLevel.toLowerCase() !==
                          "event_host" &&
                        DTOdata.goingStatus.toLowerCase() !== "going" ? (
                          <Button
                            colorScheme="milk"
                            size="md"
                            variant="outline"
                            leftIcon={<CheckCircleIcon />}
                            onClick={onAccept}
                          >
                            Accept Invite
                          </Button>
                        ) : null
                      ) : null}
                    </Flex>

                    <Flex justify={"center"}>
                      {DTOdata ? (
                        DTOdata.eventAccessLevel.toLowerCase() ===
                        "event_host" ? (
                          <Button
                            colorScheme="milk"
                            size="md"
                            variant="outline"
                            leftIcon={<CheckCircleIcon />}
                            onClick={onManage}
                          >
                            Manage Event
                          </Button>
                        ) : null
                      ) : null}
                    </Flex>
                  </Stack>
                </GridItem>
                <GridItem pl="2" area={"time"} color="white">
                  <Flex justifyContent="center">{event.time}</Flex>
                  <Flex justifyContent="center" color="teal.200">{DTOdata? DTOdata.goingStatus +": "+ DTOdata.eventInvitedStatus: null}</Flex>
                </GridItem>
              </Grid>
            )}

            {matches.small && (
              <Grid
                templateAreas={`"nav button"
                  "title time"
                  "event event"`}
                gridTemplateRows={"1fr 1fr 3fr"}
                gridTemplateColumns={"1fr 1fr"}
                h="300px"
                gap="1"
                color="blackAlpha.700"
                fontWeight="bold"
                justifyContent="center"
                alignItems="center"
              >
                <GridItem pl="1" area={"title"} color="white">
                  <Flex ml="1em">{event.eventTitle}</Flex>
                </GridItem>
                <GridItem area={"nav"} color="white">
                  <Flex mb="0.5em" ml="2.5em" mt="1em">
                    {status == "error"
                      ? "User Not Exist"
                      : status == "loading"
                      ? "loading user information"
                      : data.fullName}
                  </Flex>
                  <Flex mx="2em">
                    <UserProfilePhotoSmall userId={session.user.id} />
                  </Flex>
                </GridItem>
                <GridItem pl="1" area={"event"} color="white">
                  <Flex ml="1em" flexDirection="column">
                    <Flex>{event.eventDescription} </Flex>
                    <Flex>Where: {event.eventLocation}</Flex>
                    <Flex>
                      When: {event.date} {event.time}
                    </Flex>
                  </Flex>
                </GridItem>
                <GridItem pl="1" area={"button"} color="white">
                  <Stack direction="column" spacing={3} justify="center">
                    <Flex justify={"center"}>
                      <Button
                        colorScheme="milk"
                        size="md"
                        variant="outline"
                        onClick={onChatClick}
                      >
                        Live Chat
                      </Button>
                    </Flex>
                    <Flex justify={"center"}>
                      <Button
                        colorScheme="milk"
                        size="md"
                        variant="outline"
                        leftIcon={<AddIcon />}
                      >
                        Apply Event
                      </Button>
                    </Flex>
                    <Flex justify={"center"}>
                      <Button
                        colorScheme="milk"
                        size="md"
                        variant="outline"
                        leftIcon={<CheckCircleIcon />}
                      >
                        Accept Invite
                      </Button>
                    </Flex>
                  </Stack>
                </GridItem>
                <GridItem pl="1" area={"time"} color="white">
                  <Flex justifyContent="center">{event.time}</Flex>
                  <Flex justifyContent="center" color="teal.200">
                    {DTOdata
                      ? DTOdata.goingStatus + " " + DTOdata.eventInvitedStatus
                      : null}
                  </Flex>
                </GridItem>
              </Grid>
            )}
          </Fragment>
        )}
      </Media>
    </Box>
  );
}

export default EventCard;
