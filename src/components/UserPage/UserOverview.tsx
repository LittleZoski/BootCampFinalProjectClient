import { Dog } from "@/types/dog";

import {
  Flex,
  VStack,
  SimpleGrid,
  GridItem,
  Heading,
  Box,
} from "@chakra-ui/react";
import { DogAvatarSmall } from "../DogCard";
import { UserProfilePhoto } from "./UserProfilePhoto";
import { User, UserProfile } from "@/types/user";
import { Friendship } from "@/types/friendship";
import { FriendButtonUserSummary } from "../Friends/FriendButton";

type UserSideBarProps = {
  user: User;
  dogList: Dog[];
  friendList: Friendship[];
  userProfile: UserProfile;
};

const UserOverView: React.FC<UserSideBarProps> = ({
  user,
  dogList,
  friendList,
  userProfile,
}) => {
  return (
    <>
      <Flex h={{ base: "auto" }} py={5}>
        <UserProfilePhoto photoId={userProfile.profilePhotoId} />
        <VStack>
          <SimpleGrid
            id="userData"
            columns={1}
            columnGap={3}
            rowGap={1}
            w={"full"}
            pl={3}
          >
            <GridItem colSpan={1}>
              <Heading>{user.fullName}</Heading>
            </GridItem>
            <GridItem colSpan={1} pl={1}>
              <FriendsAndDogs friendList={friendList} dogList={dogList} />
            </GridItem>
            <GridItem colSpan={1} columnGap={0} pl={1}>
              {dogList.map((dog: Dog, index: number) => (
                <DogAvatarSmall key={index} dog={dog} />
              ))}
            </GridItem>
          </SimpleGrid>
        </VStack>
        <Box ml={"auto"}>
          <FriendButtonUserSummary friends={friendList} userId={user.id} />
        </Box>
      </Flex>
    </>
  );
};

//This next part is WILDY over-engineered.
interface FriendsAndDogsProps {
  friendList: Friendship[];
  dogList: Dog[];
}

const FriendsAndDogs = ({ friendList, dogList }: FriendsAndDogsProps) => {
  let friend: string;
  let friendLen: number | string;
  let dog: string;
  let dogLen: number | string;

  if (friendList.length === undefined) {
    friend = "Friends";
    friendLen = "0";
  } else {
    friend = friendList.length === 1 ? "Friend" : "Friends";
    friendLen = friendList.length;
  }

  if (dogList === undefined) {
    dog = "Dogs";
    dogLen = "0";
  } else {
    dog = dogList.length === 1 ? "Dog" : "Dogs";
    dogLen = dogList.length;
  }
  return (
    <>
      {friendLen} {friend} | {dogLen} {dog}
    </>
  );
};

export default UserOverView;
