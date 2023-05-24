import { useGetDogByOwnerId } from "@/queries/dog.queries";
import { useGetFriendList } from "@/queries/friend.queries";
import { useGetUserInfo, useGetUserProfile } from "@/queries/user.queries";
import { Container } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { FriendPage } from "../Friends/FriendPage";
import UserOverView from "./UserOverview";
import UserShortcutBar from "./UserShortcutBar";
import UserSideBar from "./UserSideBar";
import Loader from "../CustomComponents/Loader";
import { useEffect, useState } from "react";
import { UserPetPage } from "./UserPetPage";
import UserEvents from "./UserEvents";

function UserPage({ userId }: { userId: number }) {
  const { data: session } = useSession();

  const [viewAbout, setViewAbout] = useState(true);
  const [viewPets, setViewPets] = useState(false);
  const [viewFriends, setViewFriends] = useState(false);
  const [viewPhotos, setViewPhotos] = useState(false);
  const [viewEvents, setViewEvents] = useState(false);
  const [viewAwards, setViewAwards] = useState(false);

  useEffect(() => {
    // Reset the state values to their default state when userId changes
    setViewAbout(true);
    setViewPets(false);
    setViewFriends(false);
    setViewPhotos(false);
    setViewEvents(false);
    setViewAwards(false);
  }, [userId]);

  const { isLoading: userIsLoading, data: userData } = useGetUserInfo(
    session?.accessToken,
    userId
  );

  const { isLoading: dogListIsLoading, data: dogList } = useGetDogByOwnerId(
    session?.accessToken,
    userId
  );

  const { isLoading: friendListIsLoading, data: friendList } = useGetFriendList(
    session?.accessToken,
    userId
  );

  const { isLoading: profileIsLoading, data: userProfile } = useGetUserProfile(
    session?.accessToken,
    userId
  );

  if (
    dogListIsLoading ||
    userIsLoading ||
    profileIsLoading ||
    friendListIsLoading
  ) {
    return <Loader />;
  }
  return (
    <>
      <Container maxW="container.xl" backgroundColor={"#F5F2EA"} rounded={"lg"}>
        <UserOverView
          user={userData}
          dogList={dogList}
          friendList={friendList}
          userProfile={userProfile}
          session={session}
        />
        <UserShortcutBar
          user={userData}
          setViewAbout={setViewAbout}
          setViewPets={setViewPets}
          setViewFriends={setViewFriends}
          setViewPhotos={setViewPhotos}
          setViewEvents={setViewEvents}
          setViewAwards={setViewAwards}
        />
        {viewAbout && (
          <UserSideBar
            user={userData}
            dogList={dogList}
            userProfile={userProfile}
          />
        )}
        {viewPets && <UserPetPage dogList={dogList} />}
        {viewFriends && <FriendPage friendList={friendList} />}
        {viewEvents && <UserEvents />}
      </Container>
    </>
  );
}

export default UserPage;
