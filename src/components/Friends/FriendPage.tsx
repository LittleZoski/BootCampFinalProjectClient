import { getAxiosBackend } from "@/api/api";
import { useGetDogByOwnerId } from "@/queries/dog.queries";
import { useGetFriendList } from "@/queries/friend.queries";
import { Friendship } from "@/types/friendship";
import { User } from "@/types/user";
import {
  Box,
  Button,
  Flex,
  GridItem,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spacer,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useQueries } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { UserProfilePhotoSmall } from "../UserPage/UserProfilePhoto";
import { FriendButton } from "./FriendButton";
import Loader from "../CustomComponents/Loader";
import router, { useRouter } from "next/router";
import { Dog } from "@/types/dog";

const FriendPage = (props: any) => {
  const friendList: Friendship[] = props.friendList;
  const { data: session } = useSession();

  const [searchQuery, setSearchQuery] = useState("");

  // Map over the friendList array and create an array of query objects.
  const multiUserQuery = friendList.map((friendship) => ({
    queryKey: ["userId", friendship.secondaryUserId],
    queryFn: async () =>
      (
        await getAxiosBackend(session?.accessToken).get<User>(
          `/users/${friendship.secondaryUserId}`
        )
      ).data,
  }));

  // Run all queries in parallel
  const queryResults = useQueries({ queries: multiUserQuery });

  if (queryResults.some((result) => result.status === "loading")) {
    return <div>Loading user data...</div>;
  }

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
        <Flex pb={3} pl={4}>
          <Heading size={"lg"} color={"#886E58"}>
            Friends
          </Heading>
          <Spacer />
          <Box>
            <Input
              borderColor={"#886E58"}
              borderWidth="2px"
              borderRadius={"10px"}
              placeholder={"Search"}
              value={searchQuery}
              onChange={(searchBox) => setSearchQuery(searchBox.target.value)}
            />
          </Box>
        </Flex>
        <Flex>
          <Button color={"#886E58"} variant="ghost" size={"lg"}>
            All Friends
          </Button>
          <Button color={"#886E58"} variant="ghost" size={"lg"}>
            Mutual Friends
          </Button>
        </Flex>
        <Flex pl={6}>
          <SimpleGrid columns={2} w={"full"} py={2} spacingY={5} spacingX={5}>
            {queryResults
              .filter((result) =>
                result.data.fullName
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map((result, index) => (
                <FriendCard
                  key={friendList[index].secondaryUserId}
                  userData={result.data}
                />
              ))}
          </SimpleGrid>
        </Flex>
      </Box>
    </Box>
  );
};

const FriendCard = ({ userData }: { userData: User }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSmallerScreen] = useMediaQuery("(max-width: 768px)");
  const buttonWidth = isSmallerScreen ? "full" : "auto";
  const buttonPT = isSmallerScreen ? "1" : "0";
  const buttonPR = isSmallerScreen ? "0" : "1";

  const viewUser = () => {
    router.push({ pathname: `/user-profile`, query: { myParam: userData.id } });
  };

  if (!userData) {
    return <Loader />;
  }

  const { isLoading: friendListIsLoading, data: friendList } = useGetFriendList(
    session?.accessToken,
    userData.id
  );

  const { isLoading: dogListIsLoading, data: dogList } = useGetDogByOwnerId(
    session?.accessToken,
    userData.id
  );

  if (friendListIsLoading || dogListIsLoading) {
    return <Loader />;
  }

  return (
    <GridItem
      colSpan={1}
      borderWidth="2px"
      borderColor={"#886E58"}
      rounded={"lg"}
      shadow="lg"
      backgroundColor={"transparent"}
    >
      <Flex direction={isSmallerScreen ? "column" : "row"} height="100%">
        <Box flex="1">
          <HStack>
            <Box pb={1} pl={1} onClick={viewUser}>
              <UserProfilePhotoSmall userId={userData.id} />
            </Box>
            <Box onClick={viewUser}>
              <Heading size={"l"}>{userData.fullName}</Heading>
              <Text fontSize="xs">
                <FriendsAndDogs
                  isSmallerScreen={isSmallerScreen}
                  friendList={friendList}
                  dogList={dogList}
                />
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box
          alignSelf={isSmallerScreen ? "stretch" : "center"}
          width={buttonWidth}
          pt={buttonPT}
          pr={buttonPR}
        >
          <FriendButton friends={friendList} />
        </Box>
      </Flex>
    </GridItem>
  );
};

//This next part is WILDY over-engineered.
interface FriendsAndDogsProps {
  isSmallerScreen: boolean;
  friendList: Friendship[];
  dogList: Dog[];
}

const FriendsAndDogs = ({
  isSmallerScreen,
  friendList,
  dogList,
}: FriendsAndDogsProps) => {
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

  if (isSmallerScreen) {
    return (
      <>
        {dogLen} {dog}
      </>
    );
  } else {
    return (
      <>
        {friendLen} {friend} | {dogLen} {dog}
      </>
    );
  }
};

export { FriendPage, FriendCard };
