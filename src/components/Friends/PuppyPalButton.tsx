import { useGetCurrentUserDogs } from "@/queries/dog.queries";
import { useSession } from "next-auth/react";
import Loader from "../CustomComponents/Loader";
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
import { useRouter } from "next/router";
import {
  useAcceptPuppyPalRequest,
  useCancelPuppyPalRequest,
  useGetPuppyPals,
  useGetReceivedPuppyPalRequests,
  useGetSentPuppyPalRequests,
  useRejectPuppyPalRequest,
  useRemovePuppyPal,
  useSendPuppyPalRequest,
} from "@/queries/dog.friend.queries";
import React, { useState } from "react";
import { Dog } from "@/types/dog";

export const PuppyPalButton = () => {
  const { data: session } = useSession();
  const { isLoading: dogListIsLoading, data: dogList } = useGetCurrentUserDogs(
    session?.accessToken
  );

  if (dogListIsLoading) {
    return <Loader />;
  }

  if (dogList.length == 0) {
    return <PuppyPalNoDogs />;
  }

  //IF USER HAS 1 DOG
  if (dogList.length == 1) {
    // TODO(Trystan): Brian, do something.
    return (
      <PuppyPalSingleDog userDog={dogList.at(0)} targetDogId={dogList[0].id} />
    );
  }

  //IF USER HAS MORE THAN ONE DOGS. MAYBE THESE NEED TO BE THEIR OWN COMPONENTS, IDK.
  if (dogList.length < 1) {
    const currentUserId = session?.user.id;
  }
};

export const PuppyPalNoDogs = () => {
  const router = useRouter();
  const addDog = () => {
    router.push({ pathname: `/create` });
  };
  return <Button onClick={addDog}>Add a Dog to Add a PuppyPal</Button>;
};

type PuppyPalSingleDogProps = {
  userDog: Dog;
  targetDogId: number;
};

export const PuppyPalSingleDog: React.FC<PuppyPalSingleDogProps> = ({
  userDog,
  targetDogId,
}) => {
  const [buttonType, setButtonType] = useState<ButtonType>();
  const [relationId, setRelationId] = useState<number>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();
  const { isLoading: puppyPalsIsLoading, data: puppyPals } = useGetPuppyPals(
    session?.accessToken,
    userDog.id
  );

  targetDogId = 8;

  const { isLoading: isSentRequestLoading, data: sentRequests } =
    useGetSentPuppyPalRequests(session?.accessToken, userDog.id);

  const { isLoading: isReceivedRequestLoading, data: receivedRequests } =
    useGetReceivedPuppyPalRequests(session?.accessToken, userDog.id);

  const sendRequestMutation = useSendPuppyPalRequest(
    session?.accessToken,
    setRelationId
  );

  const acceptRequestMutation = useAcceptPuppyPalRequest(
    session?.accessToken,
    setRelationId
  );

  const cancelRequestMutation = useCancelPuppyPalRequest(session?.accessToken);
  const rejectRequestMutation = useRejectPuppyPalRequest(session?.accessToken);
  const removeFriendMutation = useRemovePuppyPal(session?.accessToken);

  const handleCancel = () => {
    cancelRequestMutation.mutate(relationId);
    setRelationId(targetDogId);
    setButtonType(3);
  };

  const handleNewRequest = async () => {
    try {
      await sendRequestMutation.mutateAsync({
        senderId: userDog.id,
        receiverId: targetDogId,
      });
      setButtonType(1);
    } catch (error) {
      console.error("Error handling new request", error);
    }
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
      setRelationId(targetDogId);
      setButtonType(3);
    } catch {}
  };

  const handleRemoveFriend = () => {
    try {
      removeFriendMutation.mutateAsync(relationId);
      setRelationId(targetDogId);
      setButtonType(3);
    } catch {}
  };

  if (puppyPalsIsLoading || isReceivedRequestLoading || isSentRequestLoading) {
    return <Loader />;
  }

  if (buttonType == undefined && relationId == undefined) {
    if (puppyPals.some((friend) => friend.secondaryUserId === targetDogId)) {
      setButtonType(0);
      setRelationId(
        puppyPals.find((friend) => friend.secondaryUserId === targetDogId).id
      );
    } else if (
      sentRequests.some((request) => request.receiverId === targetDogId)
    ) {
      setButtonType(1);
      setRelationId(
        sentRequests.find((req) => req.receiverId === targetDogId).id
      );
    } else if (
      receivedRequests.some((request) => request.senderId === targetDogId)
    ) {
      setButtonType(2);
      setRelationId(
        receivedRequests.find((req) => req.senderId === targetDogId).id
      );
    } else {
      setButtonType(3);
      setRelationId(targetDogId);
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
                  Please confirm if you'd like to remove this dog as a friend
                  from your dog.
                </Text>

                <Flex justifyContent="space-between" pt={8}>
                  <Button
                    backgroundColor={"#F5F2EA"}
                    onClick={handleRemoveFriend}
                  >
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
        <Button bg={"#886E58"} textColor="white" onClick={() => handleCancel()}>
          Cancel Request
        </Button>
      );

    case ButtonType.REQUEST_RESPOND:
      return (
        <Popover>
          <PopoverTrigger>
            <Button bg={"#886E58"} textColor="white">
              Respond to PuppyPal Request
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
          Add PuppyPal
        </Button>
      );
  }
};

enum ButtonType {
  DELETE_FRIEND,
  REQUEST_CANCEL,
  REQUEST_RESPOND,
  REQUEST_SEND,
}
