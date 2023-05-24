import React from "react";
import { useRouter } from "next/router";
import DogProfile from "@/components/dogProfileComponents/DogProfile";

function dogProfile() {
  const { query } = useRouter();

  if (query.myParam !== undefined) {
    const id = query.myParam as unknown as number;

    return (
      <div>
        <DogProfile dogId={id} />
      </div>
    );
  }
}
export default dogProfile;
