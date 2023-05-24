import { useFormik } from "formik";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Event } from "@/types/event";
import { useSession } from "next-auth/react";
import Loader from "../CustomComponents/Loader";
import { Challenge } from "@/types/challenges";
import { useCreateChallenges } from "@/queries/challenges.queries";
import { ChevronDownIcon } from "@chakra-ui/icons";

type LatLngLiteral = google.maps.LatLngLiteral;

export default function CreateChallengeForm({ event }: { event: Event }) {
  const { data: session, status } = useSession();
  const createChallenge = useCreateChallenges(session?.accessToken);
  
  if (status === "loading") {
    return <Loader />;
  }
  const [isLargerThan950] = useMediaQuery("(min-width: 950px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });
  const initialValues: Challenge = {
    name: "",
    description: "",
    price: 0,
    eventId: 0,
    rewardImage: "",
  };

  const ChallengeSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Title must be at least two characters")
      .required("This field is required"),
    description: Yup.string()
      .min(2, "Location must be at least two characters")
      .required("This field is required"),
    eventId: Yup.number().required("This field is required"),
  });

  const submitCreateCallenge = (formValues: Challenge) => {
    formValues.eventId = event.eventId;
    createChallenge.mutate(formValues);
  };

  const formik = useFormik({
    initialValues,
    onSubmit: submitCreateCallenge,
    validationSchema: ChallengeSchema,
  });

  return (

    <Box>
      {isLargerThan950 ? (<Flex>
      <form
        style={{
          margin: "20px 20px 20px 20px ",
          backgroundColor: "#886E58",
          width: "30em",
          padding: "50px 50px",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
        onSubmit={formik.handleSubmit}
      >
        <Stack spacing={4}>
          <FormControl
            isRequired
            isInvalid={formik.errors.name && formik.touched.name ? true : false}
          >
            <FormLabel>Challenge Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              formik.errors.description && formik.touched.description
                ? true
                : false
            }
          >
            <FormLabel>description</FormLabel>
            <Input
              type="text"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={
              formik.errors.price && formik.touched.price ? true : false
            }
          >
            <FormLabel>price</FormLabel>
            <Input
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={
              formik.errors.rewardImage && formik.touched.rewardImage
                ? true
                : false
            }
          >
            <FormLabel>RewardImage</FormLabel>
            <Input
              type="text"
              name="rewardImage"
              value={formik.values.rewardImage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              
            />
            <FormErrorMessage>{formik.errors.rewardImage}</FormErrorMessage>
          </FormControl>

          <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Actions
              </MenuButton>
              <MenuList>
                <MenuItem onClick={()=>{formik.setFieldValue("rewardImage", "https://w7.pngwing.com/pngs/23/86/png-transparent-reward-cup-medal-desktop-wallpaper-trophies-thumbnail.png"   )}}>Trophy</MenuItem>
                <MenuItem onClick={()=>{formik.setFieldValue("rewardImage", "https://cdn.shopify.com/s/files/1/0277/9601/3133/products/product-image-895532113_2048x2048.jpg?v=1589045021"   )}}>Crown</MenuItem>
                
              </MenuList>
            </Menu>

          <Input type="hidden" name="eventId" value={formik.values.eventId} />

          <Button type="submit">Create</Button>
        </Stack>
      </form>
    </Flex>):(<Flex>
      <form
        style={{
          margin: "5px 5px 5px 5px ",
          backgroundColor: "#886E58",
          width: "100px",
          padding: "20px 20px",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
        onSubmit={formik.handleSubmit}
      >
        <Stack spacing={4}>
          <FormControl
            isRequired
            isInvalid={formik.errors.name && formik.touched.name ? true : false}
          >
            <FormLabel>Challenge Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              formik.errors.description && formik.touched.description
                ? true
                : false
            }
          >
            <FormLabel>description</FormLabel>
            <Input
              type="text"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={
              formik.errors.price && formik.touched.price ? true : false
            }
          >
            <FormLabel>price</FormLabel>
            <Input
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormErrorMessage>{formik.errors.price}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={
              formik.errors.rewardImage && formik.touched.rewardImage
                ? true
                : false
            }
          >
            <FormLabel>RewardImage</FormLabel>
            <Input
              type="text"
              name="rewardImage"
              value={formik.values.rewardImage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              
            />
            <FormErrorMessage>{formik.errors.rewardImage}</FormErrorMessage>
          </FormControl>

          <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Actions
              </MenuButton>
              <MenuList>
                <MenuItem onClick={()=>{formik.setFieldValue("rewardImage", "https://w7.pngwing.com/pngs/23/86/png-transparent-reward-cup-medal-desktop-wallpaper-trophies-thumbnail.png"   )}}>Trophy</MenuItem>
                <MenuItem onClick={()=>{formik.setFieldValue("rewardImage", "https://cdn.shopify.com/s/files/1/0277/9601/3133/products/product-image-895532113_2048x2048.jpg?v=1589045021"   )}}>Crown</MenuItem>
                
              </MenuList>
            </Menu>

          <Input type="hidden" name="eventId" value={formik.values.eventId} />

          <Button type="submit">Create</Button>
        </Stack>
      </form>
    </Flex>)}
    </Box>
    
  );
}
