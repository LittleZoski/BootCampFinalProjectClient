import { useGetDogPhoto } from "@/queries/dog.queries";
import { Avatar, Spinner } from "@chakra-ui/react";

function DogProfilePhoto({
	id,
	accessToken,
}: {
	id: number;
	accessToken: string;
}) {
	const { status, data } = useGetDogPhoto(accessToken, id);

	if (status === "loading") {
		return <Spinner></Spinner>;
	}

	if (status === "success") {
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
	}
}
export default DogProfilePhoto;
