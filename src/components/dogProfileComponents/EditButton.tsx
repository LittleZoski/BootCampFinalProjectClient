import {
  useDeleteDogProfile,
  useUpdateDogProfile,
  useUploadDogPhoto,
} from "@/queries/dog.queries";
import { DogProfile } from "@/types/dog-profile";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Router, useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import ImageUploadComponent from "../ImageHandling/ImageUploadComponent";
import EditDog from "./EditDog";

function EditButton({
  dogProfile,
  accessToken,
}: {
  dogProfile: DogProfile;
  accessToken: string;
}) {
  const {
    isOpen: openModal,
    onOpen: modal,
    onClose: closeModal,
  } = useDisclosure();
  const {
    isOpen: openDelete,
    onOpen: deleteDog,
    onClose: closeDelete,
  } = useDisclosure();
  const {
    isOpen: openPhotoUpload,
    onOpen: photoUpload,
    onClose: closePhotoUpload,
  } = useDisclosure();

  const [selectedFile, setSelectedFile] = useState(null);
  const cancelRef = React.useRef();
  const router = useRouter();
  const deleteDogProfile = useDeleteDogProfile(accessToken);
  const uploadPhotoMutation = useUploadDogPhoto(accessToken);
  const updateDogProfile = useUpdateDogProfile(accessToken);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [missingFile, setMissingFile] = useState(false);

  const handleFileSelect = (event) => {
    if (missingFile === true) {
      setSelectedFile(event.target.files[0]);
      setMissingFile(false);
    } else {
      setSelectedFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (updateDogProfile.isSuccess) {
      closePhotoUpload();
      setSelectedFile(null);
      queryClient.invalidateQueries();
    }
    setLoading(false);
  }, [updateDogProfile.isSuccess]);

  async function handlePhotoUpload() {
    if (selectedFile != null) {
      setLoading(true);
      const photoResponse = await uploadPhotoMutation.mutateAsync({
        dogId: dogProfile.dog.id,
        file: selectedFile,
      });
      const profilePhotoId = await photoResponse.data;
      const newData: DogProfile = {
        id: dogProfile.id,
        profilePhotoId: profilePhotoId,
        dog: dogProfile.dog,
        temperament: dogProfile.temperament,
        bio: dogProfile.bio,
      };
      await updateDogProfile.mutateAsync(newData);
    } else {
      setMissingFile(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (deleteDogProfile.isSuccess) {
      router.push({
        pathname: `/home`,
      });
    }
  }, [deleteDogProfile.isSuccess]);

  function handleDelete() {
    setLoading(true);
    deleteDogProfile.mutate(dogProfile.id);
  }

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          border={"1px solid #886E58"}
          rightIcon={<ChevronDownIcon />}
        >
          Edit
        </MenuButton>
        <MenuList>
          <MenuItem onClick={photoUpload}>Change Profile Picture</MenuItem>
          <MenuItem onClick={modal}>Edit About Info</MenuItem>
          <MenuItem onClick={deleteDog}>Delete Dog Profile</MenuItem>
        </MenuList>
      </Menu>

      <Modal isOpen={openPhotoUpload} onClose={closePhotoUpload} size={"lg"}>
        <ModalOverlay />
        <ModalContent width={"2xl"}>
          <ModalCloseButton
            onClick={() => {
              setMissingFile(false);
            }}
          />
          <ModalBody marginTop={"30px"}>
            <ImageUploadComponent handleFileSelect={handleFileSelect} />
            {missingFile ? (
              <Text textAlign={"center"} marginTop={"10px"} color={"#886E58"}>
                Please select a file{" "}
              </Text>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button
              backgroundColor={"#886E58"}
              color={"white"}
              mr={3}
              isLoading={loading}
              onClick={handlePhotoUpload}
            >
              Save changes
            </Button>
            <Button
              color={"#886E58"}
              variant="ghost"
              onClick={() => {
                closePhotoUpload();
                setMissingFile(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={openModal} onClose={closeModal} size={"md"}>
        <ModalOverlay />
        <ModalContent width={"5xl"}>
          <ModalCloseButton />
          <EditDog
            dogProfile={dogProfile}
            accessToken={accessToken}
            handleFormSubmission={() => {
              queryClient.invalidateQueries();
              closeModal();
            }}
          />
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={openDelete}
        leastDestructiveRef={cancelRef}
        onClose={closeDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="#886E58">
              Delete Profile
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {dogProfile.dog.name}'s profile?
              You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                backgroundColor={"#886E58"}
                color={"white"}
                onClick={handleDelete}
                isLoading={loading}
              >
                Delete
              </Button>
              <Button
                ref={cancelRef}
                onClick={closeDelete}
                ml={3}
                color={"#886E58"}
                variant="ghost"
              >
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
export default EditButton;
