import { getAllUser } from "@/queries/user.queries";
import { Search2Icon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Container,
	Heading,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightAddon,
	Spinner,
	Stack,
	StackDivider,
	Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import UserSearchListing from "./UserSearchListing";

function UserSearchList() {
	const { data: session } = useSession();
	const getAllUsers = getAllUser(session?.accessToken);
	const [search, setSearch] = useState("");

	if (getAllUsers.status === "loading") {
		return <Spinner></Spinner>;
	}

	if (getAllUsers.status === "success") {
		const users = getAllUsers.data;

		const getFilteredResults = (search) => {
			if (search === "") {
				return users;
			} else {
				const newFilteredUsers = users.filter((user) =>
					user.displayName.toLowerCase().startsWith(search.toLowerCase())
				);
				return newFilteredUsers;
			}
		};
		return (
			<Container>
				<Card maxWidth={"xl"}>
					<CardHeader>
						<InputGroup
							size="md"
							borderRadius={10}
							backgroundColor={"white"}
							marginTop={"10px"}
							maxWidth="md"
						>
							<InputLeftElement
								pointerEvents="none"
								children={<Search2Icon color="gray.600" />}
							/>
							<Input
								onChange={(e) => {
									setSearch(e.target.value);
									getFilteredResults(search);
								}}
								value={search}
								type="text"
								placeholder="Search users"
								border="1px solid #949494"
							/>
						</InputGroup>
					</CardHeader>

					<CardBody>
						<Stack divider={<StackDivider />} spacing="4">
							{getFilteredResults(search).map((user) => (
								<UserSearchListing
									user={user}
									accessToken={session?.accessToken}
								/>
							))}
						</Stack>
					</CardBody>
				</Card>
			</Container>
		);
	}
}

export default UserSearchList;
