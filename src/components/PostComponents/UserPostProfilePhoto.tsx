import { useGetUserPicByPicId } from "@/queries/user.queries";
import { Avatar, Spinner } from "@chakra-ui/react";

function UserPostProfilePhoto({
	photoId,
	accessToken,
}: {
	photoId: string;
	accessToken: string;
}) {
	const { status, data } = useGetUserPicByPicId(accessToken, photoId);

	if (status === "loading") {
		return <Spinner></Spinner>;
	}

	if (status === "success") {
		return (
			<Avatar
				size={"md"}
				src={`data:image/png;base64, ${data}`}
				css={{
					border: "3px solid #886E58",
					marginTop: "5px",
				}}
				boxShadow={
					"0px 1px 10px -5px rgb(0 0 0 / 57%), 0 10px 10px -5px rgb(0 0 0 / 45%)"
				}
			/>
		);
	}
}
export default UserPostProfilePhoto;
