import { hostInviteToEvent } from '@/queries/event.querues';
import { getAllUser } from '@/queries/user.queries'
import { User } from '@/types/user';
import { Box, Flex } from '@chakra-ui/react'
import { useSession } from 'next-auth/react';
import React from 'react'
import UserCard from './UserCard';
import { Event } from "@/types/event";

function UserList({eventId}:{eventId?:number}) {
  const { data: session } = useSession();
  const {status,data} = getAllUser(session?.accessToken)
  const hostInvite = hostInviteToEvent(session?.accessToken);

  const hostInviteUser = (eventId, userId)=>{
    hostInvite.mutate(eventId, userId)
  }

  if(status==="loading"){
    return(<>is loading</>)
  }

  if(status==="error"){
    return (<>get all user call failed</>)
  }

  return (
    <Box px="12">
        <Flex flexDirection={"column"} gap="2">
          {data.map((userInfo:User, key:number)=>{
            return(<Flex><UserCard user={userInfo} eventId={eventId}/></Flex>)
          })}
        </Flex>
    </Box>
  )
}

export default UserList    