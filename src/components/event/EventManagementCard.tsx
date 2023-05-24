import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { Event } from "@/types/event";
import { useSession } from "next-auth/react";
import { getUserById } from "@/queries/user.queries";
import {
  deleteEventByEventId,
  hostAcceptUserApplication,
} from "@/queries/event.querues";
import { getAllUserEventDto } from "@/queries/userEventDTO.queries";
import UpdateEvent from "./UpdateEvent";
import UserList from "../user/UserList";
import Map from "../map/Map";
import DogCardForEvent from "./DogCardForEvent";
import EventDogList from "./EventDogList";
import DataAnalytic from "./DataAnalytic";
import CreateChallengeForm from "../Challenges/CreateChallengesForm";
import RewardPanel from "../Challenges/RewardPanel";
import { UserProfilePhotoSmall } from "../UserPage/UserProfilePhoto";

function EventManagementCard({ event }: { event: Event }) {
  const { data: session } = useSession();
  const { status, data } = getUserById(session?.accessToken, event.hostId);
  const { DTOListstatus, DTOListdata } = getAllUserEventDto(
    session?.accessToken,
    event.eventId
  );
  const hostDeleteEvent = deleteEventByEventId(session?.accessToken);

  const hostAcceptApplication = hostAcceptUserApplication(session?.accessToken);

  const initialFocusRef = React.useRef();

  const onClickAccept = (event) => {
    let eventId = Number(
      (event.target as HTMLElement).getAttribute("data-eventId")
    );
    let userId = Number(
      (event.target as HTMLElement).getAttribute("data-userId")
    );
    hostAcceptApplication.mutate({ eventId, userId });
  };

  const handleDelete = (e) => {
    hostDeleteEvent.mutate(event.eventId);
  };

  if (DTOListstatus === "loading") {
    return <>"is loading"</>;
  }

  if (DTOListstatus === "error") {
    return <>"there is an error for getUserDtoList call"</>;
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="1.5em"
      bg={"#886E58"}
      mb="5"
      fontFamily={"font-family: Arial, sans-serif;"}
      fontSize="3xl"
      fontStyle={"italic"}
      alignSelf={"center"}
    >
      <Tabs variant="soft-rounded" colorScheme="teal">
        <TabList ml={"0.5em"} mt={"0.5em"}>
          <Tab>Management</Tab>
          <Tab>Rewards</Tab>
          <Tab>Analytics</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box mx="1.5em" mt="2em" mb="2em">
              <Flex flexDirection={"column"} gap="2">
                <Flex className="header" justifyContent={"center"}>
                  <Map event={event} />
                </Flex>
                <Flex mt={"1em"}>{event.eventTitle}</Flex>
                <Flex>
                  {event.date} {event.time}
                </Flex>
                <Flex>{event.eventLocation}</Flex>
                <Flex>{event.eventDescription}</Flex>
                <Flex flexDirection={"row"} gap="18" flexWrap={"wrap"}>
                  <Button
                    colorScheme={"teal"}
                    overflow="hidden"
                    textOverflow={"ellipsis"}
                  >
                    Invite friends
                  </Button>
                  <EventDogList
                    DTOListdata={DTOListdata}
                    eventId={event.eventId}
                  />
                  <Popover
                    initialFocusRef={initialFocusRef}
                    placement="bottom"
                    closeOnBlur={false}
                  >
                    <PopoverTrigger>
                      <Button
                        colorScheme={"teal"}
                        overflow="hidden"
                        textOverflow={"ellipsis"}
                      >
                        Update Event
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      color="white"
                      bg="blue.800"
                      borderColor="blue.800"
                      boxSize={"500 500"}
                    >
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        <UpdateEvent event_Id={event.eventId} />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>

                  <Popover
                    initialFocusRef={initialFocusRef}
                    placement="bottom"
                    closeOnBlur={false}
                  >
                    <PopoverTrigger>
                      <Button
                        colorScheme={"teal"}
                        overflow="hidden"
                        textOverflow={"ellipsis"}
                      >
                        Invite User
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      color="white"
                      bg="blue.800"
                      borderColor="blue.800"
                      boxSize={"500 500"}
                      fontSize="18"
                    >
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        <UserList eventId={event.eventId} />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <Button
                    colorScheme={"teal"}
                    onClick={handleDelete}
                    overflow="hidden"
                    textOverflow={"ellipsis"}
                  >
                    Delete Event
                  </Button>
                  <Button
                    colorScheme={"teal"}
                    overflow="hidden"
                    textOverflow={"ellipsis"}
                  >
                    Refresh
                  </Button>
                </Flex>
                <Box>
                  <Flex
                    mt="1.5em"
                    fontFamily={"sans-serif"}
                    fontSize="33"
                    justifyContent={"center"}
                  >
                    RSVP
                  </Flex>
                  <Flex
                    flexDirection={"row"}
                    gap="5"
                    flexWrap={"wrap"}
                    mt="2em"
                    justifyContent={"center"}
                  >
                    {DTOListdata
                      ? DTOListdata.map((DTO) => {
                          return (
                            <Flex
                              flexDirection={"column"}
                              backgroundColor="#C2C0C7"
                              width="180px"
                              height="190px"
                              gap={"1.5"}
                              borderRadius="18"
                              fontFamily={"sans-serif"}
                              fontSize="16"
                            >
                              <Flex>
                                <UserProfilePhotoSmall userId={DTO.id} />
                              </Flex>
                              <Flex ml={"2"}>{DTO.userName}</Flex>
                              <Flex ml={"2"}>
                                {DTO.eventAccessLevel === "EVENT_HOST"
                                  ? "Host"
                                  : "Guest"}
                              </Flex>
                              <Flex ml={"2"} color="teal">
                                {DTO.eventInvitedStatus} {DTO.goingStatus}
                              </Flex>
                              <Flex>
                                <DogCardForEvent userId={DTO.userId} />
                              </Flex>

                              <Flex alignSelf={"center"}>
                                {DTO.eventInvitedStatus.toLowerCase() ===
                                "applied" ? (
                                  <Button
                                    colorScheme={"teal"}
                                    data-eventId={DTO.eventId}
                                    data-userId={DTO.userId}
                                    onClick={(event) => onClickAccept(event)}
                                  >
                                    Accept
                                  </Button>
                                ) : null}
                              </Flex>
                            </Flex>
                          );
                        })
                      : null}
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </TabPanel>
          <TabPanel>
            <RewardPanel event={event} />
          </TabPanel>
          <TabPanel>
            <DataAnalytic eventId={event.eventId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default EventManagementCard;
