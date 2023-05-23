import { getAxiosBackend } from "@/api/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User, UserProfile } from "@/types/user";

export const useCreateUser = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation(
    (user: User) => backendAPI.put<User>(`/users/${user.id}`, user),
    {
      onError: (error) => {
        throw error;
      },
    }
  );
};

export const useCreateUserProfile = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation(
    (userProfile: UserProfile) =>
      backendAPI.post<UserProfile>(`/users/profile`, userProfile),
    {
      onError: (error) => {
        throw error;
      },
    }
  );
};

export const useGetUserInfo = (accessToken: string, userId: number) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useQuery({
    queryKey: ["users", userId],
    queryFn: async () => (await backendAPI.get<User>(`/users/${userId}`)).data,
    enabled: !!accessToken,
  });
};

export function getUserById(accessToken: string, userId: number) {
  const backendAPI = getAxiosBackend(accessToken);
  const { status, data } = useQuery({
    queryKey: [userId],
    queryFn: () => {
      return backendAPI.get<User>(`/users/${userId}`).then((res) => res.data);
    },
    // make the query wait for accesstoken, !! is a short hand. !!accessToken turn it into a boolean
    enabled: !!accessToken,
  });
  return { status, data };
}

export function getAllUser(accessToken: string) {
  const backendAPI = getAxiosBackend(accessToken);
  const { status, data } = useQuery({
    queryKey: ["getAllUser"],
    queryFn: () => {
      return backendAPI.get<User[]>(`/users`).then((res) => res.data);
    },
    // make the query wait for accesstoken, !! is a short hand. !!accessToken turn it into a boolean
    enabled: !!accessToken,
  });
  return { status, data };
}

export const useGetUserProfile = (accessToken: string, userId: number) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<UserProfile>({
    queryKey: ["getUserProfile", userId],
    queryFn: () => {
      return backendAPI.get(`/users/profile/${userId}`).then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
};

export const useGetUserPicByPicId = (accessToken: string, photoId: string) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<string>({
    queryKey: ["getUserPicByPicId", photoId],
    queryFn: () => {
      return backendAPI
        .get(`/users/profilephoto/${photoId}`)
        .then((response) => {
          return response.data;
        });
    },
    retry: false,
    enabled: !!accessToken,
  });
};

export const useGetUserPicByUserId = (
  accessToken: string,
  userId: string | number
) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<string>({
    queryKey: ["getUserPicByUserId", userId],
    queryFn: () => {
      return backendAPI.get(`/users/ppuid/${userId}`).then((response) => {
        return response.data;
      });
    },
    retry: false,
    enabled: !!accessToken,
  });
};

export function useGetUserById(accessToken: string, userId: number) {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => {
      return backendAPI.get(`/users/${userId}`).then((response) => {
        return response.data;
      });
    },
    enabled: !![accessToken, userId],
  });
}

export function useUpdateUserProfile(accessToken: string) {
  const backendAPI = getAxiosBackend(accessToken);
  return useMutation({
    mutationFn: (userProfile: UserProfile) => {
      return backendAPI
        .put(`users/profile/${userProfile.id}`, userProfile)
        .then((response) => {
          response.data;
        });
    },
  });
}

export const useUploadUserPhoto = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useMutation(
    ({ file }: { file: any }) => {
      const formData = new FormData();
      formData.append("file", file);
      return backendAPI.post(`/user/photos`, formData, {
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
