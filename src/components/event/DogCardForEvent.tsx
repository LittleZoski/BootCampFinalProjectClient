import {
  useGetDogByOnwerIdv2,
  useGetDogProfileByDogId,
  useGetDogProfileByDogIdv2,
} from "@/queries/dog.queries";
import { Dog } from "@/types/dog";
import {
  Flex,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Input,
  GridItem,
  Heading,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { BsGenderMale } from "react-icons/bs";
import { IoMdFemale} from "react-icons/io";
import ChatWithOpenAi from "../OpenAIComponent/ChatWithOpenAi";
import DogProfileInEvent from "./DogProfileInEvent";

function DogCardForEvent({ userId }: { userId: number }) {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const { dogListStatus, dogList } = useGetDogByOnwerIdv2(
    session?.accessToken,
    userId
  );
  const [dogRendered, setDogRendered] = useState<Dog>()

  if (dogListStatus === "loading") return <>Loading</>;

  if (dogListStatus === "error") return <>there is an error loading dogList</>;
  
  return (
    <Flex mt={"1.5"}>
      {dogList &&
        dogList.map((dog) => {
          return (
            <Flex flexDirection={"column"}>
              <Button
                ref={btnRef}
                size={"xs"}
                width={"2.5em"}
                onClick={() => {
                  setDogRendered(dog)
                  onOpen()
                }}
              >
                <DogProfileInEvent dog={dog}/>
              </Button>
              <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
                size="sm"
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>{dogRendered && dogRendered.name}</DrawerHeader>
                  <DrawerBody >
                    
                    <GridItem colSpan={3} marginTop={"30px"}>
                      <Heading size={"md"}><DogProfileInEvent dog={dog}/> {dogRendered && dogRendered.name}  {dogRendered && dogRendered.sex==="FEMALE"? <IoMdFemale />: <BsGenderMale/>}</Heading>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <Heading color={"#886E58"} size={"sm"}>
                        Breed: {dogRendered && dogRendered.breed}
                      </Heading>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <Heading color={"#886E58"} size={"sm"}>
                        Size: {dogRendered && dogRendered.size} 
                      </Heading>
                    </GridItem>
                    
                    <GridItem colSpan={1}>
                      <Heading color={"#886E58"} size={"sm"}>
                      Sex: {dogRendered && dogRendered.sex.toLowerCase()}
                      </Heading>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <Heading color={"#886E58"} size={"sm"}>
                        {dogRendered && dogRendered.weightLbs}Lb
                      </Heading>
                    </GridItem>
                  </DrawerBody>
                  <DrawerBody>
                    <ChatWithOpenAi />
                  </DrawerBody>
                  

                  <DrawerFooter>
                    <Button variant="outline" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button colorScheme="blue">Save</Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </Flex>
          );
        })}
    </Flex>
  );
}

export default DogCardForEvent;
