import { User } from "@/types/user";
import { Flex, Button } from "@chakra-ui/react";

type UserShortcutBarProps = {
  user: User;
  setViewAbout: React.Dispatch<React.SetStateAction<boolean>>;
  setViewPets: React.Dispatch<React.SetStateAction<boolean>>;
  setViewFriends: React.Dispatch<React.SetStateAction<boolean>>;
  setViewPhotos: React.Dispatch<React.SetStateAction<boolean>>;
  setViewEvents: React.Dispatch<React.SetStateAction<boolean>>;
  setViewAwards: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserShortcutBar: React.FC<UserShortcutBarProps> = ({
  user,
  setViewAbout,
  setViewPets,
  setViewFriends,
  setViewPhotos,
  setViewEvents,
  setViewAwards,
}) => {
  const renderAbout = () => {
    setViewAbout(true);
    setViewPets(false);
    setViewFriends(false);
    setViewPhotos(false);
    setViewEvents(false);
    setViewAwards(false);
  };

  const renderPets = () => {
    setViewAbout(false);
    setViewPets(true);
    setViewFriends(false);
    setViewPhotos(false);
    setViewEvents(false);
    setViewAwards(false);
  };

  const renderFriends = () => {
    setViewAbout(false);
    setViewPets(false);
    setViewFriends(true);
    setViewPhotos(false);
    setViewEvents(false);
    setViewAwards(false);
  };

  const renderPhotos = () => {};

  const renderEvents = () => {
    setViewAbout(false);
    setViewPets(false);
    setViewFriends(false);
    setViewPhotos(false);
    setViewEvents(true);
    setViewAwards(false);
  };
  return (
    <>
      <Flex w={"full"}>
        <Button bg={"#886E58"} textColor="white" onClick={renderAbout}>
          About
        </Button>
        <Button onClick={renderPets} bg={"#886E58"} textColor="white">
          Pets
        </Button>
        <Button bg={"#886E58"} textColor="white">
          Spots
        </Button>
        <Button onClick={renderFriends} bg={"#886E58"} textColor="white">
          Friends
        </Button>
        <Button onClick={renderPhotos} bg={"#886E58"} textColor="white">
          Photos
        </Button>
        <Button onClick={renderEvents} bg={"#886E58"} textColor="white">
          Events
        </Button>
        <Button bg={"#886E58"} textColor="white">
          Awards
        </Button>
      </Flex>
    </>
  );
};

export default UserShortcutBar;
