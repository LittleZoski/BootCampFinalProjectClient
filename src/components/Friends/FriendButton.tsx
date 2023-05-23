import {
  useAcceptFriendRequest,
  useCancelFriendRequest,
  useGetReceivedFriendRequests,
  useGetSentFriendRequests,
  useRejectFriendRequest,
  useRemoveFriend,
  useSendFriendRequest,
} from "@/queries/friend.queries";
import { FriendRequestWithUser, Friendship } from "@/types/friendship";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Loader from "../CustomComponents/Loader";

enum ButtonType {
  DELETE_FRIEND,
  REQUEST_CANCEL,
  REQUEST_RESPOND,
  REQUEST_SEND,
}

export const FriendButton = ({ friends }: { friends: Friendship[] }) => {
  const [buttonType, setButtonType] = useState<ButtonType>();
  const [relationId, setRelationId] = useState<string | number>();

  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUserId = session?.user.id;
  const cardUserId = friends.at(0).primaryUserId;

  const sendRequestMutation = useSendFriendRequest(
    session?.accessToken,
    setRelationId
  );
  const acceptRequestMutation = useAcceptFriendRequest(
    session?.accessToken,
    setRelationId
  );
  const { data: sentRequest, isLoading: isSentRequestLoading } =
    useGetSentFriendRequests(session?.accessToken);
  const { data: receivedRequest, isLoading: isReceivedRequestLoading } =
    useGetReceivedFriendRequests(session?.accessToken);

  const cancelRequestMutation = useCancelFriendRequest(session?.accessToken);
  const rejectRequestMutation = useRejectFriendRequest(session?.accessToken);
  const removeFriendMutation = useRemoveFriend(session?.accessToken);

  const handleCancel = () => {
    cancelRequestMutation.mutate(relationId);
    setRelationId(cardUserId);
    setButtonType(3);
  };

  const handleNewRequest = () => {
    try {
      sendRequestMutation.mutateAsync(relationId);
      setButtonType(1);
    } catch {}
  };

  const handleAcceptRequest = () => {
    try {
      acceptRequestMutation.mutateAsync(relationId);
      setButtonType(0);
    } catch {}
  };

  const handleRejectRequest = () => {
    try {
      rejectRequestMutation.mutateAsync(relationId);
      setRelationId(cardUserId);
      setButtonType(3);
    } catch {}
  };

  const handleRemoveFriend = () => {
    try {
      removeFriendMutation.mutateAsync(relationId);
      setRelationId(cardUserId);
      setButtonType(3);
    } catch {}
  };

  if (isSentRequestLoading || isReceivedRequestLoading) {
    return <Loader />;
  }

  if (buttonType == undefined || relationId == undefined) {
    if (friends.some((friend) => friend.secondaryUserId === currentUserId)) {
      setButtonType(0);
      setRelationId(
        friends.find((friend) => friend.secondaryUserId === currentUserId).id
      );
    } else if (
      sentRequest.some((request) => request.receiverId === cardUserId)
    ) {
      setButtonType(1);
      setRelationId(
        sentRequest.find((req) => req.receiverId === cardUserId).id
      );
    } else if (
      receivedRequest.some((request) => request.senderId === cardUserId)
    ) {
      setButtonType(2);
      setRelationId(
        receivedRequest.find((req) => req.senderId === cardUserId).id
      );
    } else {
      setButtonType(3);
      setRelationId(cardUserId);
    }
  }
  switch (buttonType) {
    case ButtonType.DELETE_FRIEND:
      return (
        <>
          <Button w={"100%"} onClick={onOpen} bg={"#886E58"} textColor="white">
            Remove Friend
          </Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  Please confirm if you'd like to remove this user as a friend.
                </Text>

                <Flex justifyContent="space-between" pt={8}>
                  <Button colorScheme="blue" onClick={handleRemoveFriend}>
                    Confirm
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </Flex>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      );

    case ButtonType.REQUEST_CANCEL:
      return (
        <Button
          w={"100%"}
          onClick={() => handleCancel()}
          bg={"#886E58"}
          textColor="white"
        >
          Cancel Request
        </Button>
      );

    case ButtonType.REQUEST_RESPOND:
      return (
        <Popover>
          <PopoverTrigger>
            <Button>Respond</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              <Flex justifyContent="space-between">
                <Button colorScheme="whatsapp" onClick={handleAcceptRequest}>
                  Accept Request
                </Button>
                <Button colorScheme="red" onClick={handleRejectRequest}>
                  Reject Request
                </Button>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      );

    default:
      return (
        <Button
          w={"100%"}
          onClick={handleNewRequest}
          bg={"#886E58"}
          textColor="white"
        >
          Add Friend
        </Button>
      );
  }
};

interface FBUSProps {
  friends: Friendship[];
  userId: string | number;
}

export const FriendButtonUserSummary: React.FC<FBUSProps> = ({
  friends,
  userId,
}) => {
  const [buttonType, setButtonType] = useState<ButtonType>();
  const [relationId, setRelationId] = useState<string | number>();
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUserId = session?.user.id;

  const cardUserId = friends.at(0).primaryUserId;
  const sendRequestMutation = useSendFriendRequest(
    session?.accessToken,
    setRelationId
  );
  const acceptRequestMutation = useAcceptFriendRequest(
    session?.accessToken,
    setRelationId
  );
  const { data: sentRequest, isLoading: isSentRequestLoading } =
    useGetSentFriendRequests(session?.accessToken);
  const { data: receivedRequest, isLoading: isReceivedRequestLoading } =
    useGetReceivedFriendRequests(session?.accessToken);

  const cancelRequestMutation = useCancelFriendRequest(session?.accessToken);
  const rejectRequestMutation = useRejectFriendRequest(session?.accessToken);
  const removeFriendMutation = useRemoveFriend(session?.accessToken);

  const handleCancel = () => {
    cancelRequestMutation.mutate(relationId);
    setRelationId(cardUserId);
    setButtonType(3);
  };

  const handleNewRequest = () => {
    try {
      sendRequestMutation.mutateAsync(relationId);
      setButtonType(1);
    } catch {}
  };

  const handleAcceptRequest = () => {
    try {
      acceptRequestMutation.mutateAsync(relationId);
      setButtonType(0);
    } catch {}
  };

  const handleRejectRequest = () => {
    try {
      rejectRequestMutation.mutateAsync(relationId);
      setRelationId(cardUserId);
      setButtonType(3);
    } catch {}
  };

  const handleRemoveFriend = () => {
    try {
      removeFriendMutation.mutateAsync(relationId);
      setRelationId(cardUserId);
      setButtonType(3);
    } catch {}
  };

  if (isSentRequestLoading || isReceivedRequestLoading) {
    return <Loader />;
  }

  if (buttonType == undefined || relationId == undefined) {
    if (friends.some((friend) => friend.secondaryUserId === currentUserId)) {
      setButtonType(0);
      setRelationId(
        friends.find((friend) => friend.secondaryUserId === currentUserId).id
      );
    } else if (
      sentRequest.some((request) => request.receiverId === cardUserId)
    ) {
      setButtonType(1);
      setRelationId(
        sentRequest.find((req) => req.receiverId === cardUserId).id
      );
    } else if (
      receivedRequest.some((request) => request.senderId === cardUserId)
    ) {
      setButtonType(2);
      setRelationId(
        receivedRequest.find((req) => req.senderId === cardUserId).id
      );
    } else {
      setButtonType(3);
      setRelationId(cardUserId);
    }
  }
  switch (buttonType) {
    case ButtonType.DELETE_FRIEND:
      return (
        <>
          <Button onClick={onOpen} bg={"#886E58"} textColor="white">
            Remove Friend
          </Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  Please confirm if you'd like to remove this user as a friend.
                </Text>

                <Flex justifyContent="space-between" pt={8}>
                  <Button colorScheme="blue" onClick={handleRemoveFriend}>
                    Confirm
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </Flex>
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      );

    case ButtonType.REQUEST_CANCEL:
      return <Button onClick={() => handleCancel()}>Cancel Request</Button>;

    case ButtonType.REQUEST_RESPOND:
      return (
        <Popover>
          <PopoverTrigger>
            <Button bg={"#886E58"} textColor="white">
              Respond
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              <Flex justifyContent="space-between">
                <Button colorScheme="whatsapp" onClick={handleAcceptRequest}>
                  Accept Request
                </Button>
                <Button colorScheme="red" onClick={handleRejectRequest}>
                  Reject Request
                </Button>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      );

    default:
      return (
        <Button bg={"#886E58"} textColor="white" onClick={handleNewRequest}>
          Add Friend
        </Button>
      );
  }
};

interface FNButtonProps {
  friendRequestId: number;
}

export const FriendNotificationButton: React.FC<FNButtonProps> = ({
  friendRequestId,
}) => {
  return <Button>Button Goes here</Button>;
};
