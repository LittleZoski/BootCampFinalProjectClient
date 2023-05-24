import { getAxiosBackend } from "@/api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  FriendRequest,
  FriendRequestWithUser,
  Friendship,
} from "@/types/friendship";
import { Dispatch, SetStateAction } from "react";
import { User } from "@/types/user";

export const useGetFriendList = (
  accessToken: string,
  userId: string | number
) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<Friendship[]>({
    queryKey: ["getFriendList", userId],
    queryFn: () => {
      return backendAPI.get(`/friendlist/${userId}`).then((response) => {
        return sortFriends(response.data, userId);
      });
    },
    enabled: !!accessToken,
  });
};

export const useGetSentFriendRequests = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useQuery({
    queryKey: ["getSentFriendRequests"],
    queryFn: async () =>
      (await backendAPI.get<FriendRequest[]>(`/friendrequest/sent`)).data,
    enabled: !!accessToken,
  });
};

export const useGetReceivedFriendRequests = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useQuery({
    queryKey: ["getReceivedFriendRequests"],
    queryFn: async () =>
      (await backendAPI.get<FriendRequest[]>(`/friendrequest/received`)).data,
    enabled: !!accessToken,
  });
};

export const useGetOpenFriendRequests = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useQuery({
    queryKey: ["getOpenFriendRequest"],
    queryFn: async () =>
      (
        await backendAPI.get<FriendRequestWithUser[]>(
          `friendrequest/received/full`
        )
      ).data,
    enabled: !!accessToken,
  });
};

export const useRemoveFriend = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation((friendshipId: string | number) =>
    backendAPI.delete<Friendship>(`/friendlist/${friendshipId}`)
  );
};

export const useSendFriendRequest = (
  accessToken: string,
  setRelationId: Dispatch<SetStateAction<string | number>>
) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation(
    (userId: string | number) =>
      backendAPI.post<FriendRequest>(`/friendrequest/${userId}`),
    {
      onSuccess: (response) => {
        setRelationId(response.data.id);
      },
      onError: (error) => {
        console.error("Error sending friend request", error);
      },
    }
  );
};

export const useCancelFriendRequest = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation((requestId: string | number) =>
    backendAPI
      .delete<FriendRequest>(`/cancelrequest/${requestId}`)
      .then((response) => response.data)
  );
};

export const useAcceptFriendRequestStateless = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation(
    (requestId: string | number) =>
      backendAPI.put<Friendship>(`/acceptfriendship/${requestId}`),
    {
      onSuccess: (response) => {},
      onError: (error) => {
        console.error("Error accepting request", error);
      },
    }
  );
};

export const useAcceptFriendRequest = (
  accessToken: string,
  setRelationId: Dispatch<SetStateAction<string | number>>
) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation(
    (requestId: string | number) =>
      backendAPI.put<Friendship>(`/acceptfriendship/${requestId}`),
    {
      onSuccess: (response) => {
        setRelationId(response.data.id);
      },
      onError: (error) => {
        console.error("Error accepting request", error);
      },
    }
  );
};

export const useRejectFriendRequest = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation((requestId: string | number) =>
    backendAPI.delete<FriendRequest>(`/rejectfriendship/${requestId}`)
  );
};

export const useGetMutualFriends = (
  accessToken: string,
  userId: string | number
) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useQuery(["mutualFriends", userId], () =>
    backendAPI.get<User[]>(`mutualfriends/${userId}`)
  );
};

function sortFriends(friendlist: Friendship[], userId: string | number) {
  friendlist.forEach((friendship: Friendship) => {
    if (friendship.primaryUserId != userId) {
      const tmp = friendship.secondaryUserId;
      friendship.secondaryUserId = friendship.primaryUserId;
      friendship.primaryUserId = tmp;
    }
  });
  return friendlist;
}
