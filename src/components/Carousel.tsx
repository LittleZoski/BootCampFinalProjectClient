import React from "react";
import {
  Box,
  IconButton,
  useBreakpointValue,
  Stack,
  Heading,
  Text,
  Container,
  Link,
  Flex,
  Image,
  Spacer,
  Spinner,
  Avatar,
} from "@chakra-ui/react";
// react-icons package for the icons
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
// react-slick as Carousel Lib
import Slider from "react-slick";
import { useGetDogCircus, useGetDogProfilePhoto } from "@/queries/dog.queries";
import { useSession } from "next-auth/react";
import { DogProfile } from "@/types/dog-profile";
import { Dog } from "@/types/dog";

type Card = {
  name: string;
  imageId: number;
  bio: string;
  href: string;
};

interface ProjectProps {
  card: Card;
}

// Settings for the slider
const settings = {
  dots: true,
  arrows: true,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

function Card({ card, token }: { card: Card, token: string }){
  const { data, status } = useGetDogProfilePhoto(token, card.imageId);
  if(status === "loading"){
    return <Spinner />;
  }

  return (
      <Container size="container.lg" height="372px" mb="21px">
        <Flex
          direction="column"
          justifyContent="center"
          alignItems="center"
          height="inherit"
        >
          <Spacer />
          <Stack w={"full"}>
            <Box display="flex" justifyContent="center" mt="30px">
              <Heading
                fontSize={{ base: "3xl", md: "3.5xl", lg: "4xl" }}
                color="white"
              >
                {card.name}
              </Heading>
            </Box>
          </Stack>
          <Box
            rounded={21}
            my={10}
            mx={[0, 5]}
            boxShadow={
              "0px 1px 25px -5px rgb(0 0 0 / 57%), 0 10px 10px -5px rgb(0 0 0 / 45%)"
            }
          >
            <Avatar
              size="2xl"
              verticalAlign="center"
              rounded="18px"
              src={`data:image/png;base64, ${data}`}
              objectFit="cover"
              maxH="165px"
            />
          </Box>
          <Stack w={"90%"} maxW={"95%"} transform="translate(0, -50%)">
            <Text fontSize={"12px"} color="white" textAlign={"center"}>
              {card.bio}
            </Text>
          </Stack>
          <Stack bottom="1%" transform="translate(0, -50%)">
            <Text align="center" fontSize={"11px"} fontWeight="bold">
              <Link
                color={"white"}
                href={card.href}
                title={card.name}
                textDecoration={"none"}
              >
                Check me out!
              </Link>
            </Text>
          </Stack>
          <Spacer />
        </Flex>
      </Container>
  );
}

export default function UserProfileCarousel() {
  const { data: session } = useSession();
  // As we have used custom buttons, we need a reference variable to
  // change the state
  const [slider, setSlider] = React.useState<Slider | null>(null);

  // These are the breakpoints which changes the position of the
  // buttons as the screen size changes
  const top = useBreakpointValue({ base: "50%", md: "50%" });
  const side = useBreakpointValue({ base: "1%", md: "21px" });

  let { data: circus, status: circusStatus } = useGetDogCircus(session?.accessToken);

  if(circusStatus === "loading"){
    return <Spinner />;
  }

  let maxCircus = Math.min(circus.length, 3);
  let randomCircus = new Map<number, { dog: Dog; dogProfile: DogProfile }>();
  while(randomCircus.size !== maxCircus){
    let randInt = Math.round(Math.random() * (circus.length - 1));
    randomCircus.set(randInt, circus[randInt]);
  }

  return (
    <Flex justify="space-evenly" justifyContent="center" wrap="wrap" gap="9" bg={"#F5F2EA"}>
      <Box
      
        position={"relative"}
        maxHeight={"420px"}
        maxWidth={"300px"}
        overflow={"hidden"}
      >
        {/* CSS files for react-slick */}
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        {/* Left Icon */}
        <IconButton
          aria-label="left-arrow"
          colorScheme="black"
          position="absolute"
          left={side}
          top={top}
          transform={"translate(0%, -50%)"}
          zIndex={2}
          onClick={() => slider?.slickPrev()}
        >
          <IoIosArrowBack size="30px" color="white" />
        </IconButton>
        {/* Right Icon */}
        <IconButton
          aria-label="right-arrow"
          colorScheme="black"
          position="absolute"
          right={side}
          top={top}
          transform={"translate(0%, -50%)"}
          zIndex={2}
          onClick={() => slider?.slickNext()}
        >
          <IoIosArrowForward size="30px" color="white" />
        </IconButton>
        {/* Slider setting */}
        <Slider {...settings} ref={(slider) => setSlider(slider)}>
          {Array.from(randomCircus.values()).map((item, index) => (
            <Box
              key={index}
              rounded="sm"
              borderRadius={21}
              overflow={"hidden"}
              bg="#886E58"
              mb="21px"
            >
              <Card card={{ 
                name: item.dog.name, 
                imageId: item.dogProfile.profilePhotoId, 
                bio: item.dogProfile.bio,
                href: `/dog-profile?myParam=${item.dog?.id}`
              }} token={session?.accessToken} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Flex>
  );
}
