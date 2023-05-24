import {
  Circle,
  CircleF,
  DirectionsRenderer,
  GoogleMap,
  InfoWindow,
  InfoWindowF,
  MarkerF,
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import { Event } from "@/types/event";
import { useSession } from "next-auth/react";
import { getAllEvent } from "@/queries/event.querues";
import { useRouter } from "next/router";
import { Box, Button, Flex, flexbox, position } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import EventCard from "../event/EventCard";

const libraries = ["places"] as any;
type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionasResult = google.maps.DirectionsResult;

function EventMap() {
  interface Location {
    lat: number;
    lng: number;
  }
  const containerStyle = {
    width: "1100px",
    height: "700px",
    borderRadius: "0.5em",
  };

  const { data: session } = useSession();
  const { status, data } = getAllEvent(session?.accessToken);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [direction, setDirection] = useState<DirectionasResult>(null);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [map, setMap] = useState<google.maps.Map>(null);
  const [closesteEvent, setClosesteEvent] = useState()
  const originRef: React.MutableRefObject<HTMLInputElement> = useRef();
  const destinationRef: React.MutableRefObject<HTMLInputElement> = useRef();
  const router = useRouter();
  const fetchDirection = (
    desposition: string | LatLngLiteral,
    orgposition?: string | LatLngLiteral
  ) => {
    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin: originRef.current.value
          ? originRef.current.value
          : userLocation,
        destination: desposition,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirection(result);
          setDistance(result.routes[0].legs[0].distance.text);
          setDuration(result.routes[0].legs[0].duration.text);
        }
      }
    );
  };
  
  const handleNearestEvent =()=>{
    let closestEvent = null;
    let closestDistance = Infinity;
    data.forEach((event) => {
      const distance = calculateDistance(
        event.lat,
        event.lng,
        userLocation.lat,
        userLocation.lng
      );
  
      if (distance < closestDistance) {
        closestEvent = event;
        closestDistance = distance;
      }
    });
    setClosesteEvent(closestEvent)
  }


  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const earthRadius = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    return distance;
  };


  const clearRoutes = () => {
    setDirection(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  };

  const handleRouteMap = () => {
    router.push("/map");
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBTdPPxMhqY57yRHYoP9UnBqSNHib7Fcjk",
    // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    libraries: libraries,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  if (!isLoaded || status == "loading") return <div>Loading...</div>;

  if (status == "error") return <div>event host user information error</div>;

  return (
    <Flex mt={"5"} flexDirection={"column"} alignContent={"center"}>
      <GoogleMap
        zoom={9.5}
        center={userLocation}
        mapContainerStyle={containerStyle}
        onLoad={(map) => setMap(map)}
      >
        {direction && <DirectionsRenderer directions={direction} />}
        <MarkerF
          position={userLocation}
          icon={
            "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
          }
        />

        {data.map((event) => {
          return (
            <MarkerF
              key={event.eventId}
              position={{ lat: event.lat, lng: event.lng }}
              onClick={() => {
                setSelectedEvent(event);
                fetchDirection(
                  { lat: event.lat, lng: event.lng },
                  userLocation
                );
              }}
            />
          );
        })}
        <CircleF
          center={userLocation}
          radius={10000}
          options={{ strokeColor: "#8BC34A", fillColor: "#8BC34A" }}
        />
        {selectedEvent !== null && (
          <InfoWindowF
            position={{ lat: selectedEvent.lat, lng: selectedEvent.lng }}
          >
            <Box>
              <Flex gap={1} flexDirection={"column"}>
                <Flex>{selectedEvent.eventTitle}</Flex>
                <Flex>{selectedEvent.eventDescription}</Flex>
                <Flex>{selectedEvent.eventLocation}</Flex>
                <Flex>{selectedEvent.time}</Flex>
                <Flex>{distance}</Flex>
                <Flex>
                  <Button
                    onClick={() => {
                      setSelectedEvent(null);
                      setDirection(null);
                    }}
                    size={"3"}
                  >
                    Close
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </InfoWindowF>
        )}
      </GoogleMap>

      <Flex
        justifyContent={"space-evenly"}
        alignItems="center"
        backgroundColor={"#8BCaaA"}
        pt="2"
        pb="2"
      >
        <Flex>
          <Button onClick={() => map.panTo(userLocation)}>
            <StarIcon />
          </Button>
        </Flex>

        <Flex>
          <Autocomplete>
            <input type="text" placeholder="origin" ref={originRef} />
          </Autocomplete>
        </Flex>

        <Flex>
          <Autocomplete>
            <input type="text" placeholder="destination" ref={destinationRef} />
          </Autocomplete>
        </Flex>

        <Flex>
          <Button
            onClick={() => {
              fetchDirection(
                destinationRef.current.value,
                originRef.current.value
              );
            }}
          >
            Check new Route
          </Button>
        </Flex>

        <Flex>
          <Button onClick={clearRoutes}>Clear all Routes</Button>
        </Flex>
      </Flex>

      <Flex
        justifyContent={"space-evenly"}
        alignItems="center"
        backgroundColor={"#8BCaaA"}
        pt="2"
        pb="2"
      >
        <Flex>Distance: {distance}</Flex>
        <Flex>Distance: {duration}</Flex>
      </Flex>

      <Flex>
        <Button onClick={handleRouteMap}>Map</Button>
      </Flex>
      <Flex>
        <Button onClick={handleNearestEvent}>find nearest event</Button>
      </Flex>
      <Flex>{closesteEvent && <EventCard event={closesteEvent}  />}</Flex>
    </Flex>
  );
}

export default EventMap;
