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
  Spacer,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { FriendRequestWithUser } from "@/types/friendship";
import { UserProfilePhotoSmall } from "../UserPage/UserProfilePhoto";
import { useRouter } from "next/router";
import { request } from "http";
import { useState } from "react";

export const FriendNotification = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: friendRequest, isLoading: friendRequestsIsLoading } =
    useGetOpenFriendRequests(session?.accessToken);
  const acceptRequestMutation = useAcceptFriendRequestStateless(
    session?.accessToken
  );
  const rejectRequestMutation = useRejectFriendRequest(session?.accessToken);
  const [hiddenRequests, setHiddenRequests] = useState<number[]>([]);

  const viewUser = (userId: number | string) => {
    router.push({ pathname: `/user-profile`, query: { myParam: userId } });
  };

  const handleAcceptRequest = (requestId: number | string) => {
    try {
      acceptRequestMutation.mutateAsync(requestId);
      setHiddenRequests((prev) => [...prev, Number(requestId)]);
    } catch {}
  };

  const handleRejectRequest = (requestId: number | string) => {
    try {
      rejectRequestMutation.mutateAsync(requestId);
      setHiddenRequests((prev) => [...prev, Number(requestId)]);
    } catch {}
  };

  if (friendRequestsIsLoading) {
    return <Loader />;
  }

  return (
    <>
      {friendRequest.map((frObject: FriendRequestWithUser, key: number) => {
        if (hiddenRequests.includes(frObject.friendRequest.id)) {
          return null;
        }

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
            <HStack spacing={0} alignItems="start">
              <Box pb={2} pl={1} onClick={() => viewUser(frObject.user.id)}>
                <UserProfilePhotoSmall userId={frObject.user.id} />
              </Box>
              <VStack spacing={0}>
                <Box onClick={() => viewUser(frObject.user.id)}>
                  <Heading pt={1} pl={1} size={"md"}>
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
              <Spacer />
              <Flex alignItems="center" pr={2} pt={3}>
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
              </Flex>
            </HStack>
          </Box>
        );
      })}
    </>
  );
};
