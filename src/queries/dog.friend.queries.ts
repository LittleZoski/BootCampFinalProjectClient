import { getAxiosBackend } from "@/api/api";
import { Dog } from "@/types/dog";
import { DogFriendRequest, DogFriendship } from "@/types/friendship";
import { useMutation, useQuery } from "@tanstack/react-query";
import { access } from "fs";
import { Dispatch, SetStateAction } from "react";

export const useGetPuppyPals = (accessToken: string, dogId: number) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<DogFriendship[]>({
    queryKey: ["getPuppyPals", dogId],
    queryFn: () => {
      return backendAPI.get(`/puppypals/${dogId}`).then((response) => {
        return sortFriends(response.data, dogId);
      });
    },
    enabled: !!accessToken,
  });

  function sortFriends(friendlist: DogFriendship[], dogId: number) {
    friendlist.forEach((friendship: DogFriendship) => {
      if (friendship.primaryUserId != dogId) {
        const tmp = friendship.secondaryUserId;
        friendship.secondaryUserId = friendship.primaryUserId;
        friendship.primaryUserId = tmp;
      }
    });
    return friendlist;
  }
};

export const useGetPuppyPalsMultiDog = (accessToken: string, dogs: Dog[]) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useQuery<DogFriendship[][]>({
    queryKey: ["getPuppyPalsMultiDog"],
    queryFn: async () => {
      const response = await backendAPI.post(`/puppypals/multidog`, dogs);
      return response.data;
    },
    enabled: !!accessToken,
  });
};

export const useGetSentPuppyPalRequests = (
  accessToken: string,
  dogId: number
) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useQuery({
    queryKey: ["getSentPuppyPalRequests", dogId],
    queryFn: async () =>
      (await backendAPI.get<DogFriendRequest[]>(`/puppypals/sent/${dogId}`))
        .data,
    enabled: !!accessToken,
  });
};

export const useGetPPReqMultiDog = (accessToken: string, dogs: Dog[]) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useQuery<DogFriendRequest[][]>({
    queryKey: ["getPPReqMultiDog"],
    queryFn: async () => {
      const response = await backendAPI.post(`/puppypalreqs/multidog`, dogs);
      return response.data;
    },
    enabled: !!accessToken,
  });
};

export const useGetReceivedPuppyPalRequests = (
  accessToken: string,
  dogId: number
) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useQuery({
    queryKey: ["getReceivedPuppyPalRequests", dogId],
    queryFn: async () =>
      (await backendAPI.get<DogFriendRequest[]>(`/friendrequest/received`))
        .data,
    enabled: !!accessToken,
  });
};

export const useSendPuppyPalRequest = (
  accessToken: string,
  setRelationId: Dispatch<SetStateAction<number>>
) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation<number, Error, { senderId: number; receiverId: number }>(
    ({ senderId, receiverId }) =>
      backendAPI
        .post<DogFriendRequest>(`/puppypals/${senderId}/${receiverId}`)
        .then((response) => response.data.id),
    {
      onSuccess: (id) => {
        setRelationId(id);
      },
      onError: (error) => {
        console.error("Error sending PuppyPal request", error);
      },
    }
  );
};

export const useAcceptPuppyPalRequest = (
  accessToken: string,
  setRelationId: Dispatch<SetStateAction<number>>
) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation(
    (requestId: number) =>
      backendAPI.put<DogFriendship>(`/acceptpuppypal/${requestId}`),
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

export const useCancelPuppyPalRequest = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation((requestId: number) =>
    backendAPI.delete<DogFriendRequest>(`/cancelpuppypalrequest/${requestId}`)
  );
};

export const useRejectPuppyPalRequest = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation((requestId: number) =>
    backendAPI.delete<DogFriendRequest>(`/rejectpuppypal/${requestId}`)
  );
};

export const useRemovePuppyPal = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation((friendshipId: number) =>
    backendAPI.delete<DogFriendship>(`/puppypals/${friendshipId}`)
  );
};
