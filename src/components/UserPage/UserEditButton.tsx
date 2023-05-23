import {
  useUpdateUserProfile,
  useUploadUserPhoto,
  useUserProfile,
} from "@/queries/user.queries";
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
import { Session } from "next-auth";
import { useState } from "react";
import ImageUploadComponent from "../ImageHandling/ImageUploadComponent";
import { UserProfile } from "@/types/user";

interface UserEditButtonProps {
  session: Session;
  userProfile: UserProfile;
}

export const UserEditButton: React.FC<UserEditButtonProps> = ({
  session,
  userProfile,
}) => {
  const userProfileQuery = useUserProfile(session.accessToken, userProfile.id);
  const uploadPhotoMutation = useUploadUserPhoto(session.accessToken);
  const updateUserProfile = useUpdateUserProfile(session.accessToken);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missingFile, setMissingFile] = useState(false);
  const {
    isOpen: openPhotoUpload,
    onOpen: photoUpload,
    onClose: closePhotoUpload,
  } = useDisclosure();
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  async function handleUpload() {
    if (selectedFile != null) {
      setLoading(true);
      const profilePhoto = await uploadPhotoMutation.mutateAsync({
        file: selectedFile,
      });
      const profilePhotoId = await profilePhoto.data;
      const newProfileData: UserProfile = {
        id: userProfile.id,
        profilePhotoId: profilePhotoId,
        aboutSection: userProfile.aboutSection,
      };
      await updateUserProfile.mutateAsync(newProfileData);
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
          <MenuItem onClick={photoUpload}>Change Profile Picture</MenuItem>
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
              onClick={handleUpload}
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
