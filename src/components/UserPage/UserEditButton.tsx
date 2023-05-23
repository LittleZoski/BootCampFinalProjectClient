import { ChevronDownIcon } from "@chakra-ui/icons";
import {
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
  ModalOverlay,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useState } from "react";
import ImageUploadComponent from "../ImageHandling/ImageUploadComponent";
import { UserProfile } from "@/types/user";
import { Session } from "next-auth";
import {
  useUpdateUserProfile,
  useUploadUserPhoto,
} from "@/queries/user.queries";

interface UserEditButtonProps {
  userProfile: UserProfile;
  session: Session;
}

export const UserEditButton: React.FC<UserEditButtonProps> = ({
  userProfile,
  session,
}) => {
  const {
    isOpen: openModal,
    onOpen: modal,
    onClose: closeModal,
  } = useDisclosure();

  const {
    isOpen: openPhotoUpload,
    onOpen: photoUpload,
    onClose: closePhotoUpload,
  } = useDisclosure();

  const [selectedFile, setSelectedFile] = useState(null);
  const uploadPhotoMutation = useUploadUserPhoto(session.accessToken);
  const updateUserprofileMutation = useUpdateUserProfile(session.accessToken);
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
    if (updateUserprofileMutation.isSuccess) {
      closePhotoUpload();
      setSelectedFile(null);
      queryClient.invalidateQueries();
    }
    setLoading(false);
  }, [updateUserprofileMutation.isSuccess]);

  async function handlePhotoUpload() {
    if (selectedFile != null) {
      setLoading(true);
      const photoResponse = await uploadPhotoMutation.mutateAsync({
        file: selectedFile,
      });

      const profilePhotoId = await photoResponse.data;

      const newData: UserProfile = {
        profilePhotoId: profilePhotoId,
        aboutSection: userProfile.aboutSection,
      };
      await updateUserprofileMutation.mutateAsync(newData);
    } else {
      setMissingFile(true);
      setLoading(false);
    }
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
          <MenuItem onClick={photoUpload}>Upload Profile Picture</MenuItem>
          <MenuItem onClick={modal}>Edit About Info</MenuItem>
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
    </>
  );
};
