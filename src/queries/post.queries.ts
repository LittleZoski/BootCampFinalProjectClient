import { getAxiosBackend } from "@/api/api";
import { Post, UserLikedPost } from "@/types/post";
import { UserWithDogs } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreatePost = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);
  return useMutation((post: Post) => {
    return backendAPI.post<Post>(`/posts`, post);
  });
};

export function useCreateComment(accessToken: string) {
  const backendAPI = getAxiosBackend(accessToken);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: { postId: number; post: Post }) => {
      return backendAPI
        .put<Event>(`/event/invite/${value.postId}`)
        .then((res) => res.data);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries();
    },
  });
}

export function useLikePost(accessToken: string) {
  const backendAPI = getAxiosBackend(accessToken);
  return useMutation((postId: number) => {
    return backendAPI.post(`/addLike/${postId}`);
  });
}

export function useGetLikedPostsByCurrentUser(accessToken: string) {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<UserLikedPost[]>({
    queryKey: ["useGetLikedPosts"],
    queryFn: () => {
      return backendAPI.get("/posts/likes").then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
}

export function useGetAllPosts(accessToken: string) {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<Post[]>({
    queryKey: ["useGetAllPosts"],
    queryFn: () => {
      return backendAPI.get("/posts").then((response) => {
        return response.data;
      });
    },
    enabled: !!accessToken,
  });
}

export function getAllPostsByCurrentUser(
  accessToken: string,
  currentUser: number
) {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<Post[]>({
    queryKey: ["getAllPostsByCurrentUser", currentUser],
    queryFn: () => {
      return backendAPI
        .get<Post[]>(`/posts/user/${currentUser}`)
        .then((res) => res.data);
    },
    enabled: !!accessToken,
  });
}

export function useDeleteLike(accessToken: string) {
  const backendAPI = getAxiosBackend(accessToken);
  return useMutation({
    mutationFn: (id: Post["postId"]) => {
      return backendAPI.delete(`/deleteLike/${id}`).then((response) => {
        response.data;
      });
    },
  });
}

export function useAddComment(accessToken: string) {
  const backendAPI = getAxiosBackend(accessToken);
  return useMutation({
    mutationFn: (value: { postId; comment }) => {
      return backendAPI
        .post(`/addComment/${value.postId}`, value.comment)
        .then((response) => {
          response.data;
        });
    },
  });
}

export function useGetPostsByCommentId(accessToken: string, commentId: number) {
  const backendAPI = getAxiosBackend(accessToken);
  return useQuery<Post[]>({
    queryKey: ["getAllCommentsByPostId", commentId],
    queryFn: () => {
      return backendAPI
        .get<Post[]>(`/posts/comments/${commentId}`)
        .then((response) => response.data);
    },
    enabled: !!accessToken,
  });
}

export const useGetTaggingObjects = (accessToken: string) => {
  const backendAPI = getAxiosBackend(accessToken);

  return useQuery({
    queryKey: ["getFof"],
    queryFn: async () =>
      (await backendAPI.get<UserWithDogs[]>(`/secdeg/friends`)).data,
    enabled: !!accessToken,
  });
};
