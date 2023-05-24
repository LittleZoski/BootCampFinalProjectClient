import { useGetOpenFriendRequests } from "@/queries/friend.queries";
import { useSession } from "next-auth/react";
import Loader from "../CustomComponents/Loader";
import { Box } from "@chakra-ui/react";
import { FriendRequestWithUser } from "@/types/friendship";
import { FriendNotificationButton } from "../Friends/FriendButton";

export const FriendNotification = () => {
  const { data: session } = useSession();
  const { data: friendRequest, isLoading: friendRequestsIsLoading } =
    useGetOpenFriendRequests(session?.accessToken);

  if (friendRequestsIsLoading) {
    return <Loader />;
  }

  return (
    <>
      {friendRequest.map((frObject: FriendRequestWithUser, key: number) => {
        return (
          <div key={key}>
            <p>{frObject.user.displayName}</p>
            <FriendNotificationButton friendRequestId={frObject.user.id} />
          </div>
        );
      })}
    </>
  );
};
