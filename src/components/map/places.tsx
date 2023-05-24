import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import React, { useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

type PlacesProps = {
  setLocation: (position: google.maps.LatLngLiteral, address: string) => void;
};

function places({ setLocation }: PlacesProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  // const [selected, setSelected] = useState<string|null>(null)

  const handleSelect = async (e) => {
    setValue(e.target.value, false);
    const results = await getGeocode({ address: e.target.value });
    const { lat, lng } = await getLatLng(results[0]);
    setLocation({ lat, lng }, e.target.value);
  };

  console.log(status, data);
  return (
    <FormControl>
      <FormLabel>Pick Event Location</FormLabel>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="search an address"
      />
      <FormHelperText></FormHelperText>
      <Select placeholder="Select option" onChange={handleSelect}>
        {status === "OK" &&
          data.map(({ place_id, description }) => (
            <option color="teal.200" key={place_id} value={description}>
              {description}
            </option>
          ))}
      </Select>
    </FormControl>
  );
}

export default places;
