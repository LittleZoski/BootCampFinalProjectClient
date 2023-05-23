import { Dog } from "./dog";

export type User = {
  id: number;
  fullName: string;
  displayName?: string;
  email: string;
  phoneNumber?: string;
  date_of_birth?: number[];
};

export type UserProfile = {
  id?: number;
  aboutSection: string;
  profilePhotoId: string;
  bannerPhotoId?: string;
};

export type UserWithDogs = {
  user: User;
  dogs: Dog[];
};

type eventUserRelation = {
  id: number;
  eventaccessLevel: string;
  goingStatus: string;
  eventInvitedStatus: string;
};

type userChallengeRelations = {
  Id: number;
  statusCode: string;
  completeDate: string;
};
