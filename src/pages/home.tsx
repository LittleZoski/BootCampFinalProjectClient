import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import VideoCard from "@/components/VideoCard";
import EventList from "@/components/event/EventList";
import { Box, Center, ChakraProvider, Flex, chakra } from "@chakra-ui/react";
import React from "react";
import withAuth from "@/components/withAuth";
import { FaPaw } from "react-icons/fa";
import Carousel from "@/components/Carousel";
<link
  href="https://fonts.googleapis.com/css?family=Wire+One|Raleway:300"
  rel="stylesheet"
  type="text/css"
></link>;

function home() {
  return (
    <ChakraProvider>
      <HeroSection />
      <div className="text-divider">
        <FaPaw className="divider-paw1" />
        <FaPaw className="divider-paw" />
        <FaPaw className="divider-paw2" />
      </div>
      {/* <hr className="solid"/> */}
      <Center>
        <Flex maxWidth={"500px"}>
          <chakra.h1
            textAlign={"center"}
            color={"#886E58"}
            fontSize={"4xl"}
            mt={"150px"}
            py={2}
            fontWeight={"bold"}
            fontFamily={"Poppins"}
          >
            Events Near YOU!
          </chakra.h1>
        </Flex>
      </Center>
      <Center>
        <Box width={"900px"} h={"520px"} overflowY="auto" py={5}>
          <Box>
            <EventList />
          </Box>
        </Box>
      </Center>
      <Center>
        <Flex maxWidth={"500px"}>
          <chakra.h1
            textAlign={"center"}
            color={"#886E58"}
            fontSize={"4xl"}
            py={2}
            fontWeight={"bold"}
            mt={"150px"}
            fontFamily={"Poppins"}
          >
            See What Users Are Saying:
          </chakra.h1>
        </Flex>
      </Center>
      <VideoCard />
      <Footer />
    </ChakraProvider>
  );
}

export default withAuth(home);
