import { getAllEvent } from "@/queries/event.querues";
import { useSession } from "next-auth/react";
import React from "react";
import EventCard from "../event/EventCard";
import EventNotification from "./EventNotification";
import { Flex } from "@chakra-ui/react";
import { Session, User } from "next-auth";
import { UserProfile } from "@/types/user";

type EventNotifyProps = {
  user: User;
  event: Event;
  userProfile: UserProfile;
  session: Session;
};

const EventNotify = ({ user, event, userProfile, session }) => {
  if (event.length === 0) {
    return (
      <>
        <Flex justifyContent={"center"}>No events posted yet!</Flex>
      </>
    );
  }
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {event.map((event) => (
        <EventNotification
          event={event}
          user={user}
          session={session}
          userProfile={userProfile}
          key={event.eventId}
        />
      ))}
    </div>
  );
};

export default EventNotify;
