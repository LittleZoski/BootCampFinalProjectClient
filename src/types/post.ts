import { Dog } from "./dog";
import { User } from "./user";

export type Post = {
  postId?: number;
  commentId?: number;
  message: string;
  authorId?: number;
  likeCount?: number;
  commentCount?: number;
  dateTime?: Date;
  taggedUserId?: number[];
  taggedDogId?: number[];
};

export type Suggestion = {
  id: number;
  name: string;
  type: "user" | "dog";
  owners?: string[];
};

export type TaggedObj = {
  id: number;
  name: string;
};

export type UserLikedPost = {
  postId: number;
  userId: number
}
