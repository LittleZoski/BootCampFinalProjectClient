import Loader from "@/components/CustomComponents/Loader";
import withAuth from "@/components/withAuth";
import { MessageClient, MessageRequest, MessageResponse } from "@/generated_proto/message";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import * as uuid from "uuid";
import React, { useEffect, useRef, useState } from "react";
import Chat from "@/components/Chat";
import { StatusCode } from "grpc-web";
import { getEventById } from "@/queries/event.querues";
import { Box, Heading } from "@chakra-ui/react";

function chat() {
  const { data: session } = useSession();
  const router = useRouter();
  const eventId = parseInt(router.query.id as string);

  const [messages, setMessages] = useState<Map<string, MessageResponse>>(new Map());
  const { data: event, status: eventStatus } = getEventById(session?.accessToken, eventId);
  let isConnected = useRef(false);

  const client = new MessageClient(process.env.NEXT_PUBLIC_CHAT_URL || "http://localhost:50051");

  useEffect(() => {
    if (session?.accessToken && !isConnected.current) {
      client.GetMessages(new MessageRequest({ roomId: eventId, message: "" }), { Authorization: session.accessToken }).on("data", (response) => {
        setMessages(previousMessages => new Map(previousMessages).set(uuid.stringify(response.id), response));
      });

      isConnected.current = true;
    }
  }, [session?.accessToken]);

  function sendMessage(message: string): void {
    client.SendMessage(new MessageRequest({ roomId: eventId, message }), { Authorization: session.accessToken }, (error,) => {
      if (!error || !error.code || error.code === StatusCode.OK) {
        // Success
      } else {
        // Error
      }
    });
  }

  if (eventStatus === "loading") {
    return <Loader />;
  }

  return (
    <>
      <Box display="flex" justifyContent="center" mt="30px">
        <Heading
          fontSize={{ base: "3xl", md: "3.5xl", lg: "4xl" }}
          color="black"
        >
          {event.eventTitle}
        </Heading>
      </Box>
      <Chat messages={messages} sendMessage={sendMessage} token={session?.accessToken} userId={session?.user?.id} />
    </>
  );
}

export default withAuth(chat);
