import { useFormik } from "formik";
import {
  background,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Event } from "@/types/event";
import { useCreateEvent } from "@/queries/event.querues";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import MapControl from "../map/MapControl";
import Loader from "../CustomComponents/Loader";

type LatLngLiteral = google.maps.LatLngLiteral;

export default function CreateEventForm() {
  const { data: session, status } = useSession();
  const createEvent = useCreateEvent(session?.accessToken);
  const [address, setAdress] = useState();
  const router = useRouter();
  if (status === "loading") {
    return <Loader />;
  }

  const initialValues: Event = {
    eventId: 0,
    hostId: session.user.id,
    eventTitle: "",
    eventLocation: "",
    eventDescription: "",
    date: "",
    time: "",
    lat: 0,
    lng: 0,
    eventUserRelations: [],
  };

  const SignupSchema = Yup.object().shape({
    eventTitle: Yup.string()
      .min(2, "Title must be at least two characters")
      .required("This field is required"),
    eventLocation: Yup.string()
      .min(2, "Location must be at least two characters")
      .required("This field is required"),
    date: Yup.date().required("This field is required"),
    eventDescription: Yup.string().required("This field is required"),
    time: Yup.string().required("This field is required"),
  });

  const submitCreateEvent = async (formValues: Event) => {
    let eventId = null;

    try {
      eventId = (await createEvent.mutateAsync(formValues)).eventId;
    } catch (e) {
      return;
    }
    formValues.eventId = eventId;
    router.push({
      pathname: "/manageEvent",
      query: { myParam: JSON.stringify(formValues) },
    });
  };

  const formik = useFormik({
    initialValues,
    onSubmit: submitCreateEvent,
    validationSchema: SignupSchema,
  });

  return (
    <Flex maxH={"80%"}>
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
          <Input type="hidden" name="eventId" value={formik.values.eventId} />
          <Input type="hidden" name="hostId" value={formik.values.hostId} />
          <FormControl
            isRequired
            isInvalid={
              formik.errors.eventTitle && formik.touched.eventTitle
                ? true
                : false
            }
          >
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              name="eventTitle"
              value={formik.values.eventTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormErrorMessage>{formik.errors.eventTitle}</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              formik.errors.eventLocation && formik.touched.eventLocation
                ? true
                : false
            }
          >
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              name="eventLocation"
              value={formik.values.eventLocation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormErrorMessage>{formik.errors.eventLocation}</FormErrorMessage>
          </FormControl>

          <Popover>
            <PopoverTrigger>
              <Button>choose location</Button>
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                color="teal.400"
                bg="blue.800"
                borderColor="blue.800"
                boxSize={"300 300"}
                fontSize="18"
              >
                <PopoverArrow />

                <PopoverCloseButton />
                <PopoverBody>
                  <MapControl
                    handleCallback={(
                      addressSelected,
                      position: LatLngLiteral
                    ) => {
                      formik.setFieldValue("eventLocation", addressSelected);
                      formik.setFieldValue("lat", position.lat);
                      formik.setFieldValue("lng", position.lng);
                    }}
                  />
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>

          <FormControl
            isRequired
            isInvalid={formik.errors.date && formik.touched.date ? true : false}
          >
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormErrorMessage>{formik.errors.date}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={formik.errors.time && formik.touched.time ? true : false}
          >
            <FormLabel>time</FormLabel>
            <Input
              type="time"
              name="time"
              value={formik.values.time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <FormErrorMessage>{formik.errors.time}</FormErrorMessage>
          </FormControl>

          <FormControl
            isRequired
            isInvalid={
              formik.errors.eventDescription && formik.touched.eventDescription
                ? true
                : false
            }
          >
            <FormLabel>Description</FormLabel>
            <Textarea
              name="eventDescription"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.eventDescription}
            />
            <FormErrorMessage>
              {formik.errors.eventDescription}
            </FormErrorMessage>
          </FormControl>
          <Button type="submit">Create</Button>
        </Stack>
      </form>
    </Flex>
  );
}
