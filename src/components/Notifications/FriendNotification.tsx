import { useGetOpenFriendRequests } from "@/queries/friend.queries";
import { useSession } from "next-auth/react";
import Loader from "../CustomComponents/Loader";
import { Box, Flex, GridItem, HStack, Heading, VStack } from "@chakra-ui/react";
import { FriendRequestWithUser } from "@/types/friendship";
import {
  FriendButton,
  FriendNotificationButton,
} from "../Friends/FriendButton";
import { UserProfilePhotoSmall } from "../UserPage/UserProfilePhoto";
import { useRouter } from "next/router";

export const FriendNotification = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: friendRequest, isLoading: friendRequestsIsLoading } =
    useGetOpenFriendRequests(session?.accessToken);

  const viewUser = (userId: number | string) => {
    router.push({ pathname: `/user-profile`, query: { myParam: userId } });
  };

  if (friendRequestsIsLoading) {
    return <Loader />;
  }

  return (
    <>
      {friendRequest.map((frObject: FriendRequestWithUser, key: number) => {
        return (
          <Box
            borderWidth="1px"
            borderRadius="20px"
            bg={"#F5F2EA"}
            m="3"
            pt="2"
            fontFamily={"font-family: Arial, sans-serif;"}
            fontSize={"small"}
            color={"black"}
          >
            <HStack alignItems="start">
              <Box pb={2} pl={1} onClick={() => viewUser(frObject.user.id)}>
                <UserProfilePhotoSmall userId={frObject.user.id} />
              </Box>
              <VStack>
                <Box onClick={() => viewUser(frObject.user.id)}>
                  <Heading pt={1} size={"l"}>
                    {frObject.user.fullName}
                  </Heading>
                </Box>
                <Box onClick={() => viewUser(frObject.user.id)}>
                  <Heading size={"l"}>{frObject.user.fullName}</Heading>
                </Box>
              </VStack>
            </HStack>
          </Box>
        );
      })}
    </>
  );
};
