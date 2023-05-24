import { MessageResponse } from "@/generated_proto/message";
import { useGetUserInfo } from "@/queries/user.queries";
import { Box, Button, Flex, Input, Spinner, Text } from "@chakra-ui/react";
import * as uuid from "uuid";
import { useEffect, useRef, useState } from "react";

export default function Chat({ messages, sendMessage, token, userId }: {
  messages: Map<string, MessageResponse>,
  sendMessage: (message: string) => void,
  token: string,
  userId: number
}) {
  const [messageToSend, setMessageToSend] = useState<string>("");
  const scrollableContainerRef = useRef(null);

  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sortedMessages = Array.from(messages.values()).sort((a, b) => {
    let result = a.createdAt.seconds - b.createdAt.seconds;
    if (result === 0) {
      return a.createdAt.nanos - b.createdAt.nanos;
    }
    return result;
  });

  function handleMessageSend() {
    if (messageToSend.trim() !== "") {
      sendMessage(messageToSend);
      setMessageToSend("");
    }
  }

  function onButtonClick(e: any) {
    e.preventDefault();
    handleMessageSend();
  }

  function checkEnterAndSend(e: any) {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // NOTE(Trystan): This doesn't appear to work, but I tried. lul
        setMessageToSend((prev) => prev + '\n');
        return;
      }

      e.preventDefault();
      handleMessageSend();
    }
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="md">
      <Box maxHeight={300} overflowY="auto" ref={scrollableContainerRef}>
        {sortedMessages.map((message) => (
          <ChatMessage message={message} token={token} key={uuid.stringify(message.id)} userId={userId} />
        ))}
      </Box>
      <Box mt={4}>
        <Input
          value={messageToSend}
          onChange={e => setMessageToSend(e.target.value)}
          placeholder="Type your message..."
          size="md"
          onKeyDown={checkEnterAndSend}
        />
        <Button onClick={onButtonClick} colorScheme="teal" mt={2}>
          Send
        </Button>
      </Box>
    </Box>
  );
}

function ChatMessage({ message, token, userId }: { message: MessageResponse, token: string, userId: number }) {
  const { data: user, status } = useGetUserInfo(token, message.userId);

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <Flex direction={"row"}>
      <Text mb={2} fontWeight="bold" textColor={userId === message.userId ? "darkblue" : "black"}>
        {`${user.displayName || user.fullName}:`}
      </Text>
      <Text paddingLeft={1} mb={2}>
        {message.message}
      </Text>
    </Flex>
  );
}