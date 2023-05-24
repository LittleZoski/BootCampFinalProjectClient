import { getAllEvent } from "@/queries/event.querues";
import { Box, Button, Flex, useMediaQuery } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import EventCard from "./EventCard";
import { Event } from "@/types/event";

function EventList() {
  const { data: session } = useSession();
  const { status, data } = getAllEvent(session?.accessToken);
  const [displayEventData, setDisplayEventData] = useState<Event[]>([]);
  const [sortOrder, setSortOrder] = useState<
    "asc" | "desc" | "going" | "timing"
  >("asc");

  const sortedData = useMemo(() => {
    if (data) {
      const sortedEvents = data.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.eventTitle.localeCompare(b.eventTitle);
        } else if (sortOrder === "desc") {
          return b.eventTitle.localeCompare(a.eventTitle);
        } else if (sortOrder === "timing") {
          return b.date.localeCompare(a.date);
        }
      });
      return sortedEvents;
    } else {
      return [];
    }
  }, [data, sortOrder]);

  const filterData = useMemo(() => {
    if (data) {
      return data.filter((event) => event.hostId === session.user.id);
    }
  }, [data, sortOrder]);

  const [isLargerThan950] = useMediaQuery("(min-width: 950px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });

  const handleSortOrderChange = (newSortOrder: "asc" | "desc" | "timing") => {
    setSortOrder(newSortOrder);
  };

  const handlefilter = (filterOption: "going") => {
    setSortOrder(filterOption);
  };

  if (status === "error") {
    return <div>error</div>;
  }

  if (status === "loading") {
    return <div>loading</div>;
  }
  if (status === "success" && data !== undefined) {
    if (data.length === 0) {
      return <Flex>No events posted yet!</Flex>;
    }

    return (
      <Box>
        {isLargerThan950 ? (
          <Flex flexDirection={"column"}>
            <Flex mx={"2em"} pt="3" pb="3" justifyContent={"space-around"}>
              <Flex>
                <Button onClick={() => handleSortOrderChange("asc")}>
                  Ascending
                </Button>
              </Flex>
              <Flex>
                <Button onClick={() => handleSortOrderChange("desc")}>
                  Descending
                </Button>
              </Flex>
              <Flex>
                <Button onClick={() => handlefilter("going")}>Going</Button>
              </Flex>
              <Flex>
                <Button onClick={() => handleSortOrderChange("timing")}>
                  Time
                </Button>
              </Flex>
            </Flex>

            <Flex
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {data.map((event) => (
                <EventCard event={event} key={event.eventId} />
              ))}
            </Flex>
          </Flex>
        ) : (
          <Flex flexDirection={"column"}>
            <Flex mx={"2em"} pt="3em" pb="3" justifyContent={"space-around"}>
              <Flex>
                <Button onClick={() => handleSortOrderChange("asc")}>
                  Ascending
                </Button>
              </Flex>
              <Flex>
                <Button onClick={() => handleSortOrderChange("desc")}>
                  Descending
                </Button>
              </Flex>
              <Flex>
                <Button onClick={() => handlefilter("going")}>Going</Button>
              </Flex>
              <Flex>
                <Button onClick={() => handleSortOrderChange("timing")}>
                  Time
                </Button>
              </Flex>
            </Flex>

            <Flex
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {data.map((event) => (
                <EventCard event={event} key={event.eventId} />
              ))}
            </Flex>
          </Flex>
        )}
      </Box>
    );
  }
}

export default EventList;
