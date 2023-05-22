import {
  useAcceptFriendRequestStateless,
  useGetOpenFriendRequests,
  useRejectFriendRequest,
} from "@/queries/friend.queries";
import { useSession } from "next-auth/react";
import Loader from "../CustomComponents/Loader";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { FriendRequestWithUser } from "@/types/friendship";
import { UserProfilePhotoSmall } from "../UserPage/UserProfilePhoto";
import { useRouter } from "next/router";
import { request } from "http";

export const FriendNotification = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: friendRequest, isLoading: friendRequestsIsLoading } =
    useGetOpenFriendRequests(session?.accessToken);
  const acceptRequestMutation = useAcceptFriendRequestStateless(
    session?.accessToken
  );
  const rejectRequestMutation = useRejectFriendRequest(session?.accessToken);

  const viewUser = (userId: number | string) => {
    router.push({ pathname: `/user-profile`, query: { myParam: userId } });
  };

  const handleAcceptRequest = (requestId: number | string) => {
    try {
      acceptRequestMutation.mutateAsync(requestId);
    } catch {}
  };

  const handleRejectRequest = (requestId: number | string) => {
    try {
      rejectRequestMutation.mutateAsync(requestId);
    } catch {}
  };

  if (friendRequestsIsLoading) {
    return <Loader />;
  }

  return (
    <>
      {friendRequest.map((frObject: FriendRequestWithUser, key: number) => {
        const friendString =
          frObject.mutualFriends.length == 1 ? "Friend" : "Friends";

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
              <VStack spacing={0}>
                <Box onClick={() => viewUser(frObject.user.id)}>
                  <Heading pt={1} size={"l"}>
                    {frObject.user.fullName}
                  </Heading>
                </Box>
                <Box>
                  <Tooltip
                    label={frObject.mutualFriends
                      .map((friend) => friend.fullName)
                      .join(", ")}
                    fontSize="md"
                  >
                    <Text>
                      {frObject.mutualFriends.length} Mutual {friendString}
                    </Text>
                  </Tooltip>
                </Box>
              </VStack>
              <Popover>
                <PopoverTrigger>
                  <Button bg={"#886E58"} textColor="white">
                    Respond
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverBody>
                    <Flex justifyContent="space-between">
                      <Button
                        colorScheme="whatsapp"
                        onClick={() =>
                          handleAcceptRequest(frObject.friendRequest.id)
                        }
                      >
                        Accept Request
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={() =>
                          handleRejectRequest(frObject.friendRequest.id)
                        }
                      >
                        Reject Request
                      </Button>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
          </Box>
        );
      })}
    </>
  );
};
