import { Dog } from "@/types/dog";
import { User } from "@/types/user";
import { Heading, SimpleGrid, GridItem, Flex } from "@chakra-ui/react";
import { DogCardSmall } from "../DogCard";

type UserPetsProps = {
  user: User;
  dogList: Dog[];
};

const UserPets: React.FC<UserPetsProps> = ({ user, dogList }) => {
  return (
    <>
      <SimpleGrid
        columns={2}
        w={"full"}
        borderWidth="2px"
        borderColor={"blackAlpha.600"}
        rounded="5px"
        shadow="lg"
        alignContent={"center"}
        py={2}
        spacingY={5}
        spacingX={5}
      >
        <GridItem colSpan={2}>
          <Heading size={"l"} pl={"2"}>
            {user.fullName}'s Pets
          </Heading>
        </GridItem>
        {dogList.map((dog: Dog, index: number) => (
          <GridItem
            key={index}
            colSpan={1}
            justifySelf="center"
            alignSelf="center"
          >
            <DogCardSmall dog={dog} />
          </GridItem>
        ))}
      </SimpleGrid>
    </>
  );
};

export default UserPets;
