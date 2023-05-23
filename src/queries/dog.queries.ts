import { getAxiosBackend } from "@/api/api";
import { Dog } from "@/types/dog";
import { Breed } from "@/types/breed";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BreedInfo } from "@/types/breed-info";
import { DogOwner } from "@/types/dog-owner";
import { User } from "@/types/user";
import { DogProfile } from "@/types/dog-profile";

export const useCreateDog = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation((dog: Dog) => backendAPI.post<Dog>(`/dogs`, dog), {
    onError: (error) => {
      throw error;
    },
  });
};

export const useGetDogById = (accessToken: string, id: Dog["id"]) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<Dog>({
    queryKey: ["getDogById", id],
    queryFn: () => {
      return backendAPI.get(`/dogs/${id}`).then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
};

export function useGetBreedList(accessToken: string) {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<Breed[]>({
    queryKey: ["breeds"],
    queryFn: () => {
      return backendAPI.get(`/breeds`).then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
}

export function useGetBreedInfo(accessToken: string, breedId: number) {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<BreedInfo>({
    queryKey: ["breedInfo", breedId],
    queryFn: () => {
      return backendAPI.get(`/breeds/${breedId}`).then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
}

export const useUploadDogPhoto = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation(
    ({ dogId, file }: { dogId: number; file: any }) => {
      const formData = new FormData();
      formData.append("file", file);
      return backendAPI.post(`/dogs/${dogId}/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    {
      onError: (error) => {
        throw error;
      },
    }
  );
};

export const useGetDogPhoto = (accessToken: string, id: number) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<string>({
    queryKey: ["getDogPhoto", id],
    queryFn: () => {
      return backendAPI.get(`/photos/${id}`).then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
};

export function useCreateProfile(accessToken: string) {
  const backendAPI = getAxiosBackend(accessToken);
  return useMutation((dogProfile: DogProfile) => {
    return backendAPI.post(`/dogs/profiles`, dogProfile);
  });
}

export function useGetDogProfileByDogId(accessToken: string, dogId: number) {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<DogProfile>({
    queryKey: ["getDogProfileByDogId", dogId],
    queryFn: () => {
      return backendAPI.get(`dogs/profiles/dog/${dogId}`).then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
}

export function useGetDogOwnersByDogId(accessToken: string, dogId: number) {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<DogOwner[]>({
    queryKey: ["getDogProfileByDogId", dogId],
    queryFn: () => {
      return backendAPI.get(`dogs/${dogId}/owners`).then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
}

export function useDeleteDogProfile(accessToken: string) {
  const backendAPI = getAxiosBackend(accessToken);
  return useMutation({
    mutationFn: (id: DogProfile["id"]) => {
      return backendAPI.delete(`dogs/profiles/${id}`).then((response) => {
        response.data;
      });
    },
  });
}

export function useUpdateDogProfile(accessToken: string) {
  const backendAPI = getAxiosBackend(accessToken);
  return useMutation({
    mutationFn: (dogProfile: DogProfile) => {
      return backendAPI
        .put(`dogs/profiles/${dogProfile.id}`, dogProfile)
        .then((response) => {
          response.data;
        });
    },
  });
}

export const useGetDogProfilePhoto = (accessToken: string, dogId: number) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<string>({
    queryKey: ["getDogProfilePhoto", dogId],
    queryFn: () => {
      return backendAPI
        .get(`/dogs/profile/picture/${dogId}`)
        .then((response) => {
          return response.data;
        });
    },
    retry: false,
    enabled: !!accessToken,
  });
};

export const useGetDogProfile = (accessToken: string, dogId: number) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<DogProfile>({
    queryKey: ["getDogProfile", dogId],
    queryFn: () => {
      return backendAPI.get(`/dogs/profiles/dog/${dogId}`).then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
};

export const useGetDogByOwnerId = (accessToken: string, id: User["id"]) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<Dog[]>({
    queryKey: ["getDogByOwnerId", id],
    queryFn: () => {
      return backendAPI.get(`/dogs?ownerId=${id}`).then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
};

export const useGetCurrentUserDogs = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<Dog[]>({
    queryKey: ["getCurrentUserDogs"],
    queryFn: () => {
      return backendAPI.get(`/dogs/currentuser`).then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
};

export const useGetDogByOnwerIdv2 = (accessToken: string, id: number) => {
  const backendAPI = getAxiosBackend(accessToken);
  const { status, data } = useQuery<Dog[]>({
    queryKey: ["getDogByOwnerIdv2", id],
    queryFn: () => {
      return backendAPI
        .get(`/dogs?ownerId=${id}`)
        .then((response) => response.data);
    },
    enabled: !!accessToken,
  });

  let dogListStatus = status;
  let dogList = data;
  return { dogListStatus, dogList };
};

export function useGetDogProfileByDogIdv2(accessToken: string, dogId: number) {
  const backendAPI = getAxiosBackend(accessToken);
  const { status, data } = useQuery<DogProfile>({
    queryKey: ["getDogProfileByDogIdv2", dogId],
    queryFn: () => {
      return backendAPI
        .get(`dogs/profiles/dog/${dogId}`)
        .then((response) => response.data);
    },
    enabled: !!accessToken,
  });

  let dogProfileStatus = status;
  let dogProfile = data;

  return { dogProfileStatus, dogProfile };
}
export const useGetDogCircus = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<{
  dog: Dog;
  dogProfile: DogProfile;
}[]>({
    queryKey: ["dogCircus"],
    queryFn: () => {
      return backendAPI.get(`/dogs/dogcircus`).then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
};
