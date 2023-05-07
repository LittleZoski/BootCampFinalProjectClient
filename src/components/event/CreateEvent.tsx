import withAuth from "@/components/withAuth";
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

    // router.push(`/events/${eventId}`);
  };

  const callBack = (addressSelected) => {
    setAdress(addressSelected);
  };

  const formik = useFormik({
    initialValues,
    onSubmit: submitCreateEvent,
    validationSchema: SignupSchema,
  });

  return (
    <Flex>
      <form
        style={{
          margin: "20px 20px 20px 20px ",
          backgroundColor: "#886E58",
          width: "30em",
          height: "35em",
          padding: "50px 50px",
          borderRadius: "15px",
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
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>Header</PopoverHeader>
                <PopoverCloseButton />
                <PopoverBody>
                  <MapControl
                    handleCallback={(addressSelected) => {
                      console.log(addressSelected);
                      formik.setFieldValue("eventLocation", addressSelected);
                      console.log(formik.values);
                    }}
                  />
                </PopoverBody>
                <PopoverFooter>This is the footer</PopoverFooter>
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
