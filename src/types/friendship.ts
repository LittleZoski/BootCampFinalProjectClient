import { User, UserProfile } from "./user";

export type Friendship = {
  id?: number;
  createDate: Date;
  primaryUserId: string | number;
  secondaryUserId: string | number;
};

export type FriendRequest = {
  id?: number;
  senderId: string | number;
  receiverId: string | number;
  createDate: Date;
};

export type DogFriendship = {
  id?: number;
  createDate: Date;
  primaryUserId: number;
  secondaryUserId: number;
};

export type DogFriendRequest = {
  id?: number;
  senderId: number;
  receiverId: number;
  createDate: Date;
};

export type FriendRequestWithUser = {
  friendRequest: FriendRequest;
  user: User;
  userProfile: UserProfile;
};
