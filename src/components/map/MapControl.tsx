import { getGeoCoding } from "@/queries/geocoding.queries";
import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import Places from "./places";


type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionasResult = google.maps.DirectionsResult;
const libraries = ["places"] as any

function MapControl(props) {
  interface Location {
    lat: number;
    lng: number;
  }
  const containerStyle = {
    width: "800px",
    height: "400px",
    borderRadius: "0.5em",
  };

  const smContainerStyle = {
    width: "300px",
    height: "400px",
    borderRadius: "0.5em",
  }

  const center = useMemo<LatLngLiteral>(() => ({ lat: 43, lng: -80 }), []);
  const [eventLocation, setEventLoaction] = useState<LatLngLiteral>();
  const mapRef = useRef<GoogleMap>();
  const [isLargerThan950] = useMediaQuery("(min-width: 950px)", {
    ssr: true,
    fallback: false, // return false on the server, and re-evaluate on the client side
  });
  const options = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      mapId: "b96a4b9f690958ef",
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBTdPPxMhqY57yRHYoP9UnBqSNHib7Fcjk",
    // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API,
    libraries: libraries
  });


  if (!isLoaded) return <div>Loading...</div>;

  return (

    <Box>
      {isLargerThan950 ? (<Flex flexDirection={"column"} width="100%">
      <Flex>
        <Places
          setLocation={(position, address) => {
            console.log(position, address);
            setEventLoaction(position);
            props.handleCallback(address, position);
          }}
        />
      </Flex>
      <Flex><GoogleMap
        zoom={12}
        center={eventLocation}
        mapContainerStyle={containerStyle}
        options={options}
      >
        <MarkerF position={eventLocation} />
      </GoogleMap></Flex>
    </Flex>):(<Flex flexDirection={"column"} width="100%">
      <Flex>
        <Places
          setLocation={(position, address) => {
            console.log(position, address);
            setEventLoaction(position);
            props.handleCallback(address, position);
          }}
        />
      </Flex>
      <Flex><GoogleMap
        zoom={12}
        center={eventLocation}
        mapContainerStyle={smContainerStyle}
        options={options}
      >
        <MarkerF position={eventLocation} />
      </GoogleMap></Flex>
    </Flex>)}
    </Box>



    
  );
}

export default MapControl;
