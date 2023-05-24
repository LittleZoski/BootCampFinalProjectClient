import { Box, Flex, Heading, Input, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";

export default function ImageUploadComponent({
  handleFileSelect,
}: {
  handleFileSelect: (e: any) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelectWrapper = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedFile(event.target.files ? event.target.files[0] : null);
    handleFileSelect(event);
  };

  return (
    <Box
      borderColor="gray.300"
      borderStyle="dashed"
      borderWidth="2px"
      rounded="md"
      shadow="sm"
      role="group"
      transition="all 150ms ease-in-out"
      _hover={{
        shadow: "md",
      }}
      bg={selectedFile ? "gray.50" : "white"}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box position="relative" height="100%" width="100%" flex="1">
        {selectedFile ? (
          <Box height="100%" width="100%" top="0" left="0">
            <img
              src={URL.createObjectURL(selectedFile)}
              height="100%"
              width="100%"
              alt="Preview"
            />
          </Box>
        ) : (
          <Stack p="8" textAlign="center" spacing="1">
            <Heading fontSize="lg" color="gray.700" fontWeight="bold">
              Drop image here
            </Heading>
            <Text fontWeight="light">or click to upload</Text>
          </Stack>
        )}
        <Input
          type="file"
          id="file"
          name="file"
          height="100%"
          width="100%"
          position="absolute"
          top="0"
          left="0"
          opacity="0"
          aria-hidden="true"
          accept="image/*"
          onChange={handleFileSelectWrapper}
        />
      </Box>
    </Box>
  );
}
