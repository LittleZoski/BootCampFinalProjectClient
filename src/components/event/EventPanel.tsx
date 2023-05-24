import CreateEvent from "@/pages/create-event";
import { Box, Button, Flex, Heading, useMediaQuery } from "@chakra-ui/react";
import React, { Fragment, useState } from "react";
import EventMap from "../map/EventMap";
import EventList from "./EventList";
import ManageEvent from "./ManageEvent";

function EventPanel() {
  const [eventListHasRender, setEventListRender] = useState(true);
  const [createEventRender, setCreateEventRender] = useState(false);
  const [manageEventRender, setManageEventRender] = useState(false);
  const [eventMap, seteventMap] = useState(false);

  // ssr-friendly media query with fallback
  const [isLargerThan950] = useMediaQuery("(min-width: 950px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });

  const onShowEventList = () => {
    setEventListRender(true);
    setCreateEventRender(false);
    setManageEventRender(false);
    seteventMap(false);
  };

  const onShowCreateEvent = () => {
    setEventListRender(false);
    setCreateEventRender(true);
    setManageEventRender(false);
    seteventMap(false);
  };

  const onShowManageEvent = () => {
    setEventListRender(false);
    setCreateEventRender(false);
    setManageEventRender(true);
    seteventMap(false);
  };

  const onShowEventMap = () => {
    setEventListRender(false);
    setCreateEventRender(false);
    setManageEventRender(false);
    seteventMap(true);
  };

  return (
    <Box>
      {isLargerThan950 ? (
        <Flex flexDirection="row">
          <Flex backgroundColor={"#886E58"} minHeight="100vh">
            <Box>
              <Flex backgroundColor={"#886E58"} minHeight="100vh">
                <Box>
                  <Flex mx={"1em"} alignItems={"center"} flexDirection="column">
                    <Flex pt="40%">
                      <Heading>Menu</Heading>
                    </Flex>
                    <Flex pt="40%">
                      <Button w="200px" h="50px" onClick={onShowEventList}>
                        Event List
                      </Button>
                    </Flex>
                    <Flex pt="40%">
                      <Button w="200px" h="50px" onClick={onShowCreateEvent}>
                        Create Event
                      </Button>
                    </Flex>
                    <Flex pt="40%">
                      <Button w="200px" h="50px" onClick={onShowManageEvent}>
                        Manage Event
                      </Button>
                    </Flex>
                    <Flex pt="40%">
                      <Button w="200px" h="50px" onClick={onShowEventMap}>
                        Event Map
                      </Button>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </Flex>

          <Flex mx={"10%"}>
            {eventListHasRender && <EventList />}
            {createEventRender && <CreateEvent />}
            {manageEventRender && <ManageEvent />}
            {eventMap && <EventMap />}
          </Flex>
        </Flex>
      ) : (
        <Flex flexDirection="column">
          <Flex backgroundColor={"#886E58"} justifyContent="space-evenly">
            <Box>
              <Flex mx={"3em"} flexDirection="row" gap={"2em"}>
                <Flex pt="10%">
                  <Button onClick={onShowEventList}>Event List</Button>
                </Flex>
                <Flex pt="10%">
                  <Button onClick={onShowCreateEvent}>Create Event</Button>
                </Flex>
                <Flex pt="10%">
                  <Button onClick={onShowManageEvent}>Manage Event</Button>
                </Flex>
              </Flex>
            </Box>
          </Flex>

          <Flex mx={"15%"}>
            {eventListHasRender && <EventList />}
            {createEventRender && <CreateEvent />}
            {manageEventRender && <ManageEvent />}
            {eventMap && <EventMap />}
          </Flex>
        </Flex>
      )}
    </Box>
  );
}

export default EventPanel;
