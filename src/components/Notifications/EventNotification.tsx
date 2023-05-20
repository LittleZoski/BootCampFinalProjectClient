import React, { Fragment } from "react";
import { Box, Image, Grid, Flex, Text, Center } from "@chakra-ui/react";
import { Event } from "@/types/event";
import { useSession } from "next-auth/react";
import { getUserById } from "@/queries/user.queries";
import Media from "react-media";
import NextLink from "next/link";
import {
  userAcceptEventInvite,
  userApplyToUninvitedEvent,
} from "@/queries/event.querues";
import { getUserEventDto } from "@/queries/userEventDTO.queries";
import { User, UserProfile } from "@/types/user";
import { Session } from "next-auth";

type EventNotificationProps = {
  event: Event;
  user: User;
  userProfile: UserProfile;
  session: Session;
};

const EventNotification: React.FC<EventNotificationProps> = ({
  event,
  user,
  userProfile,
  session,
}) => {
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

  return (
    <Box
      w="96%"
      borderWidth="1px"
      borderRadius="20px"
      overflow="hidden"
      bg={"#ffffff"}
      m="3"
      pt="3"
      ml="6"
      fontFamily={"font-family: Arial, sans-serif;"}
      fontSize={"small"}
      color={"black"}
    >
      <NextLink href="/events" passHref>
        <Media
          queries={{ small: "(max-width:250px)", medium: "(min-width: 350px)" }}
        >
          {(matches) => (
            <Fragment>
              {matches.medium && (
                <Grid
                  bg="#F5F2EA"
                  templateAreas={`"nav header time"
                  "nav main footer"
                  "nav main footer"`}
                  gridTemplateRows={"1fr 2fr"}
                  gridTemplateColumns={"1.5fr 5fr 3fr"}
                  h="120px"
                  gap="1"
                  color="black"
                  justifyContent="left"
                >
                  <Flex
                    flexDirection="column"
                    justifyContent={"left"}
                    bg="#F5F2EA"
                  >
                    <Flex
                      ml="5"
                      // color="black"
                      bg="#F5F2EA"
                      w={"75px"}
                      fontWeight={"bold"}
                    >
                      {status == "error"
                        ? "User does Not Exist"
                        : status == "loading"
                        ? "loading user information"
                        : user.fullName}
                    </Flex>
                    <Flex
                      pt="3"
                      mb="1em"
                      ml="3em"
                      bg="#F5F2EA"
                      w={"55px"}
                      alignContent={"center"}
                    >
                      {/* <Image
                        src={
                          status == "error"
                            ? "User Not Exist"
                            : status == "loading"
                            ? "loading user information"
                            : user.
                        }
                        alt={`Picture of ${
                          status == "error"
                            ? "User Not Exist"
                            : status == "loading"
                            ? "loading user information"
                            : user.fullName
                        }`}
                        rounded="2em"
                        width="2.75em"
                        height="2.75em"
                        boxShadow={
                          "0px 1px 18px -5px rgb(0 0 0 / 57%), 0 10px 10px -5px rgb(0 0 0 / 45%)"
                        }
                      /> */}
                    </Flex>
                  </Flex>
                  <Flex
                    ml="1"
                    bg="#F5F2EA"
                    flexDirection="column"
                    justifyContent={"left"}
                  >
                    <Box w="200px" justifyContent={"left"}>
                      <Text
                        align={"left"}
                        size={"4em"}
                        fontSize={"14px"}
                        fontWeight={"bold"}
                      >
                        {event.eventTitle}
                      </Text>
                      <Text align={"left"}>Where: {event.eventLocation}</Text>
                      <Text align={"left"}>Date: {event.date}</Text>
                      <Text align={"left"}>Time: {event.time}</Text>
                    </Box>
                  </Flex>
                </Grid>
              )}
            </Fragment>
          )}
        </Media>
      </NextLink>
    </Box>
  );
};

export default EventNotification;
