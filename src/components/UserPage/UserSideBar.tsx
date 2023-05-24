import {
  Flex,
  VStack,
  Text,
  useBreakpointValue,
  Box,
  Heading,
  Container,
} from "@chakra-ui/react";
import UserPets from "./UserPets";
import PostForm from "../PostComponents/PostForm";
import { User, UserProfile } from "@/types/user";
import { Dog } from "@/types/dog";
import UserTimeline from "./UserTimeline";
import { useSession } from "next-auth/react";

interface UserSideBarProps {
  user: User;
  dogList: Dog[];
  userProfile: UserProfile;
}

const UserSideBar: React.FC<UserSideBarProps> = ({
  user,
  dogList,
  userProfile,
}) => {
  const colSpan = useBreakpointValue({ base: "full", md: "75%" });
  const flexTimeline = useBreakpointValue({ base: "flex-start", md: "center" });
  const { data: session } = useSession();
  return (
    <>
      <Flex
        id="flexBox"
        h={"full"}
        py={5}
        direction={{ base: "column", md: "row" }}
      >
        <VStack
          w={colSpan}
          h={"full"}
          spacing={4}
          px={4}
          alignItems="flex-start"
        >
          <Box
            borderWidth="2px"
            borderColor={"blackAlpha.600"}
            rounded="5px"
            shadow="lg"
            w={"full"}
          >
            <Heading fontSize={"1rem"} size={"l"} px={2} pt={1}>
              About
            </Heading>
            <Text fontSize={"1rem"} pb={3} align={"center"}>
              {userProfile.aboutSection}
            </Text>
          </Box>
          <UserPets user={user} dogList={dogList} />
        </VStack>
        <VStack
          w={"full"}
          h={"full"}
          p={10}
          spacing={10}
          alignItems={flexTimeline}
        >
          {session?.user.id === user.id ? (
            <PostForm accessToken={session?.accessToken} />
          ) : null}

          <UserTimeline
            session={session}
            user={user}
            userProfile={userProfile}
          />
        </VStack>
      </Flex>
    </>
  );
};

export default UserSideBar;
