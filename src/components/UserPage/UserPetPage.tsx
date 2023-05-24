import { Dog } from "@/types/dog";
import { Box } from "@chakra-ui/react";
import { DogCardBig } from "../DogCard";

type UserPetPageProps = {
  dogList: Dog[];
};

export const UserPetPage: React.FC<UserPetPageProps> = ({ dogList }) => {
  return (
    <Box py={4}>
      <Box
        h={{ base: "auto", md: "100vh" }}
        p={5}
        pl={0}
        backgroundColor={"transparent"}
        rounded={"lg"}
        borderWidth="2px"
        shadow={"xl"}
        borderColor={"#886E58"}
      >
      </Box>
    </Box>
  );
};
