import { hostInviteToEvent } from "@/queries/event.querues";
import { User } from "@/types/user";
import { Avatar, Button, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { UserProfilePhotoSmall } from "../UserPage/UserProfilePhoto";

function UserCard({eventId, user}: { eventId:number, user: User}) {

    const { data: session } = useSession();
    const hostInvite = hostInviteToEvent(session?.accessToken);

    const [userId, setuserId] = useState(Number(user.id))

    const onClickInvite=()=>{
        hostInvite.mutate({eventId, userId})
    }

  return (
    <Flex
      flexDirection={"row"}
      backgroundColor="#C2C0C7"
      width="390px"
      height="69px"
      gap={"1"}
      borderRadius="18"
      justifyContent={"space-between"}
    >
      <Flex >
        <UserProfilePhotoSmall userId={session.user.id} />
      </Flex>
      <Flex>{user.fullName}</Flex>
      <Flex>{user.displayName}</Flex>

      <Flex alignSelf={"top"} >
        <Button colorScheme={"teal"} onClick={onClickInvite}>
          Invite
        </Button>

      </Flex>
    </Flex>
  );
}

export default UserCard;
