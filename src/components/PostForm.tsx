import { Box, Button, List, ListItem, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { useSession } from "next-auth/react";
import { useCreatePost, useGetTaggingObjects } from "@/queries/post.queries";
import { Post, Suggestion } from "@/types/post";
import { FaPaw } from "react-icons/fa";
import Loader from "./CustomComponents/Loader";
import { DogOwner } from "@/types/dog-owner";
function CreatePostForm() {
  const { data: session } = useSession();
  const { data: tagList, isLoading: tagListIsLoading } = useGetTaggingObjects(
    session?.accessToken
  );
  const createPostMutation = useCreatePost(session?.accessToken);
  const [message, setMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [isTagging, setIsTagging] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [taggedUser, setTaggedUser] = useState<Suggestion[]>([]);
  const [taggedDog, setTaggedDog] = useState<Suggestion[]>([]);
  const [messageBeforeAt, setMessageBeforeAt] = useState<string>("");
  const textAreaRef = useRef(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value as Post["message"];
    setMessage(value);

    if (value.charAt(value.length - 1) === "@") {
      setMessageBeforeAt(value.slice(0, -1));
      setSearchTerm("");
      setIsTagging(true);
    } else if (isTagging) {
      if (value.charAt(value.length - 1) === " ") {
        setIsTagging(false);
      } else {
        setSearchTerm(
          (prevSearchTerm) => prevSearchTerm + value.charAt(value.length - 1)
        );
      }
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === "user") {
      setTaggedUser([...taggedUser, suggestion]);
    } else {
      setTaggedDog([...taggedDog, suggestion]);
    }
    setMessage(messageBeforeAt.slice(0, -1) + " " + suggestion.name + " ");
    setIsTagging(false);
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const dogIds = taggedDog.map((dog) => dog.id);
    const userIds = taggedUser.map((user) => user.id);

    const post: Post = {
      message,
      taggedUserId: userIds,
      taggedDogId: dogIds,
    };

    try {
      createPostMutation.mutateAsync(post);
      setMessage("");
      setTaggedDog([]);
      setTaggedUser([]);
    } catch {}
  }

  //handles what options should appear in the tagging box.
  //is not correctly filtering at this time.
  useEffect(() => {
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      let newSuggestions: Suggestion[] = [];
      let userIdToName = new Map<number, string>(); // to map userId to fullName
      let dogsMap = new Map<number, DogOwner[]>(); // to map dogId to owners

      tagList.forEach((tag) => {
        userIdToName.set(tag.user.id, tag.user.fullName); // map userId to fullName

        tag.dogs.forEach((dog) => {
          if (dog.id) {
            if (!dogsMap.has(dog.id)) {
              dogsMap.set(dog.id, dog.owners);
            } else {
              let currentOwners = dogsMap.get(dog.id);
              let newOwners = [...currentOwners, ...dog.owners];
              let uniqueOwners = Array.from(
                new Set(newOwners.map((owner) => owner.userId))
              ).map((userId) =>
                newOwners.find((owner) => owner.userId === userId)
              );
              dogsMap.set(dog.id, uniqueOwners);
            }
          }
        });
      });

      // Search for user and dog names
      tagList.forEach((tag) => {
        if (tag.user.fullName.toLowerCase().includes(lowerCaseSearchTerm)) {
          newSuggestions.push({
            id: tag.user.id,
            name: tag.user.fullName,
            type: "user",
          });
        }

        tag.dogs.forEach((dog) => {
          if (
            dog.name.toLowerCase().includes(lowerCaseSearchTerm) &&
            dog.id &&
            !newSuggestions.some(
              (suggestion) =>
                suggestion.id === dog.id && suggestion.type === "dog"
            )
          ) {
            let ownerNames = dogsMap
              .get(dog.id)
              .map((owner) => userIdToName.get(owner.userId))
              .filter((name) => name !== undefined);

            newSuggestions.push({
              id: dog.id,
              name: dog.name,
              type: "dog",
              owners: ownerNames, // Store the owners' names in the owners field
            });
          }
        });
      });

      newSuggestions = newSuggestions.filter((suggestion) => {
        if (suggestion.type === "user") {
          return !taggedUser.includes(suggestion);
        } else {
          return !taggedDog.includes(suggestion);
        }
      });

      setSuggestions(newSuggestions);
    }
  }, [searchTerm, tagList]);

  //handles the focus issue after typing the @ key.
  useEffect(() => {
    if (isTagging && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isTagging]);

  //determines if a user is actually tagged in a post.
  useEffect(() => {
    // Create a new list of taggedUser and taggedDog that only contains users and dogs still in the message
    const newTaggedUser = taggedUser.filter((userSuggestion) => {
      return message.includes(userSuggestion.name);
    });

    const newTaggedDog = taggedDog.filter((dogSuggestion) => {
      return message.includes(dogSuggestion.name);
    });

    setTaggedUser(newTaggedUser);
    setTaggedDog(newTaggedDog);
  }, [message]);

  if (tagListIsLoading) {
    return <Loader />;
  }

  return (
    <Box sx={{ maxWidth: 500 }} mx="auto">
      <form onSubmit={handleSubmit}>
        <Textarea
          value={message}
          ref={textAreaRef}
          onChange={(event) => {
            handleChange(event);
          }}
          width={"400px"}
          focusBorderColor="#886E58"
          borderRadius={"20px"}
          borderColor={"#978576"}
          borderWidth={"3px"}
          placeholder="What's on your mind..."
        />

        {isTagging && (
          <Box
            border="1px solid #ccc"
            borderRadius="md"
            bg="white"
            zIndex="1"
            position="absolute"
            w="400px"
            mt={2}
          >
            <List>
              {suggestions.map((suggestion, index) => (
                <ListItem
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                  {suggestion.type === "dog" && suggestion.owners && (
                    <>
                      <Text>(Owned by {suggestion.owners.join(", ")})</Text>
                    </>
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Button className="button-74" type="submit">
          <div id="paw">
            <FaPaw />
          </div>
          <div className="post">Post</div>
        </Button>
      </form>
    </Box>
  );
}

export default CreatePostForm;
