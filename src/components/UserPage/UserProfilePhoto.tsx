import {
  useGetUserPicByPicId,
  useGetUserPicByUserId,
} from "@/queries/user.queries";
import { Avatar, Spinner } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export const UserProfilePhotoSmall = ({ userId, isNavbar }: { userId: string | number, isNavbar?: boolean }) => {
  const { data: session } = useSession();
  const { isLoading, data } = useGetUserPicByUserId(
    session?.accessToken,
    userId
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Avatar
      size={isNavbar ? "md" : "lg"}
      src={`data:image/png;base64, ${data}`}
      css={{
        border: "1px solid #886E58",
        marginTop: isNavbar ? "0px" : "5px",
      }}
      boxShadow={
        "0px 1px 18px -5px rgb(0 0 0 / 57%), 0 10px 10px -5px rgb(0 0 0 / 45%)"
      }
    />
  );
};

export const UserProfilePhoto = ({ photoId }: { photoId: string }) => {
  const { data: session } = useSession();
  const { isLoading, data } = useGetUserPicByPicId(
    session?.accessToken,
    photoId
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Avatar
      size={"2xl"}
      src={`data:image/png;base64, ${data}`}
      css={{
        border: "5px solid #886E58",
        marginTop: "5px",
      }}
      boxShadow={
        "0px 1px 18px -5px rgb(0 0 0 / 57%), 0 10px 10px -5px rgb(0 0 0 / 45%)"
      }
    />
  );
};
