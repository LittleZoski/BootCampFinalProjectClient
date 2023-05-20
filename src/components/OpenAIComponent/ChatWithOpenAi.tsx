import { openAiCompletion } from "@/queries/openAi.queries";
import { Box, Button, Flex, Input, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";

function ChatWithOpenAi() {
  const openAiResponse = openAiCompletion();
  const [formInput, setFormInput] = useState<string>("");



	const handleClear =()=>{
		
		setFormInput("")
	}
  const handleClick = () => {
    if (formInput.length > 150) {
      let truncatedContent = formInput.slice(0, 150) + "under 70 words";
    }
    let truncatedContent = formInput + "under 70 words";
    let body = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `${truncatedContent}` }],
      temperature: 0.6,
      max_tokens: 90,
    };
    openAiResponse.mutate(body);
  };
  if (openAiResponse.isLoading) {
    return <Spinner />;
  }
  if (openAiResponse.isError) {
    return <div>openAiResponse.mutate call failed</div>;
  }

  return (
    <Flex flexDirection={"column"}>
      <Flex>
        <Input
          placeholder="Type your questions here..."
          value={formInput}
          onChange={(e) => setFormInput(e.target.value)}
					height="5em"
					
        />
      </Flex>
      <Flex justifyContent={"space-around"}>
        <Flex>
          <Button onClick={() => handleClick()}>Ask OpenAI</Button>
        </Flex>
        <Flex>
          <Button onClick={() => handleClear()}>Clear</Button>
        </Flex>
      </Flex>

      <Flex>
        <Box
          color="gray.500"
          fontWeight="semibold"
          letterSpacing="wide"
          fontSize="sm"
          textTransform="uppercase"
          mt="5"
        >
          {openAiResponse.data &&
            openAiResponse.data.choices[0].message.content}
        </Box>
      </Flex>
    </Flex>
  );
}

export default ChatWithOpenAi;
