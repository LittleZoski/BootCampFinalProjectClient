import { getAllPostsByCurrentUser } from "@/queries/post.queries";
import { Flex, HStack, Stack, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import UserSideBar from "./UserSideBar";

import { User, UserProfile } from "@/types/user";
import PostComponent, {
  PostNotificationCard,
} from "../PostComponents/PostComponent";
import { Session } from "next-auth";
import Loader from "../CustomComponents/Loader";

function UserTimeline({
  session,
  user,
  userProfile,
}: {
  session: Session;
  user: User;
  userProfile: UserProfile;
}) {
  const {
    isLoading,
    error,
    isSuccess,
    data: postData,
  } = getAllPostsByCurrentUser(session?.accessToken, user?.id);

  //get all posts qeuery

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <>error calling apis</>;
  }

  if (isSuccess) {
    postData.sort(function (x, y) {
      return y.postId - x.postId;
    });

    return (
      <Stack>
        {postData.map((post) =>
          post.commentId ? null : (
            <>
              <PostComponent session={session} post={post} />
            </>
          )
        )}
      </Stack>
    );
  }
}

interface PostListNotificationProps {
  user: User;
  userProfile: UserProfile;
  session: Session;
}

export const PostListNotification: React.FC<PostListNotificationProps> = ({
  user,
  userProfile,
  session,
}) => {
  const {
    isLoading,
    error,
    isSuccess,
    data: postData,
  } = getAllPostsByCurrentUser(session?.accessToken, user?.id);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <>error calling apis</>;
  }

  if (isSuccess) {
    postData.sort(function (x, y) {
      return y.postId - x.postId;
    });

    return (
      <Stack>
        {postData.map((post) =>
          post.commentId ? null : (
            <>
              <PostNotificationCard session={session} post={post} />
            </>
          )
        )}
      </Stack>
    );
  }
};
export default UserTimeline;
