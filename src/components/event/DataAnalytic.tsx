import { useGetAllDogsInEvent } from "@/queries/event.querues";
import { Sex } from "@/types/dog";
import { Flex, Spinner } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

function DataAnalytic({ eventId }: { eventId: number }) {
  const { data: session } = useSession();
  const { status, data } = useGetAllDogsInEvent(session?.accessToken, eventId);

  if (status === "loading") return <Spinner />;
  if (status === "error")
    return <>the API call for useGetAllDogsInEvent entered an error</>;

  // counts is an object that looks like this {MALE: 1, FEMALE: 1} as it propogate the log of counts look like below
  // {MALE: 1}=>{MALE: 1, FEMALE: 1}=>{MALE: 1, FEMALE: 2}=>{MALE: 1, FEMALE: 3}=>{MALE: 2, FEMALE: 3}

  const sexCounts = data.reduce((counts, dog) => {
    const { sex } = dog;
    counts[sex] = counts[sex] ? counts[sex] + 1 : 1;
    return counts;
  }, {});

  // Rechart only take array data so we need to consruct an array that has the SexCount data in it [{…}, {…}]0: {sex: 'MALE', count: 2}1: {sex: 'FEMALE', count: 3}
  const sexData = Object.keys(sexCounts).map((sex) => ({
    sex,
    count: sexCounts[sex],
  }));
  const legendFormatterForSex = (value) => {
    const sexValues = Object.values(Sex);
    const sexIndex = value % sexValues.length;
    return sexValues[sexIndex].toLowerCase(); // Assuming Sex is the enum name
  };

  const breedCounts = data.reduce((counts, dog) => {
    const { breed } = dog;
    counts[breed] = counts[breed] ? counts[breed] + 1 : 1;
    return counts;
  }, {});

  const breedData = Object.keys(breedCounts).map((breed, index) => ({
    id: index,
    breed,
    count: breedCounts[breed],
  }));

  const COLORS = ["#8884d8", "#82ca9d", "#006c6c", "#800040", "#008000"];
  return (
    <Flex
      borderRadius={"5"}
      flexDirection="column"
      justifyContent={"center"}
      alignItems={"center"}
      fontSize={"xl"}
      flexWrap={"wrap"}
      backgroundColor={"#464b5c"}
    >
      <Flex>
        <BarChart
          width={450}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e858f" />
          <XAxis dataKey="name" stroke="#916065" />
          <YAxis stroke="#916065" />
          <Tooltip />
          <Legend />
          <Bar dataKey="weightLbs" fill="#52cff2" stackId="a" />
          <Bar dataKey="age" fill="#568f1e" stackId="b" />
        </BarChart>
      </Flex>

      <Flex mt={"5"}>
        <PieChart width={450} height={400}>
          <Pie
            data={sexData}
            dataKey="count"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            fill="#82ca9d"
            label
          >
            {sexData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend formatter={legendFormatterForSex} />
        </PieChart>
      </Flex>

      <Flex mt={"15"} pt={"5"}>
        <PieChart width={450} height={400}>
          <Pie
            data={breedData}
            dataKey="count"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            fill="#82ca9d"
            label
          >
            {breedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend
            formatter={(value) => {
              const breed = breedData.find((entry) => entry.id === value);
              return breed ? breed.breed : "";
            }}
            layout="vertical" // Set the legend layout to vertical
            wrapperStyle={{
              paddingTop: "10px", // Adjust the top padding
            }}
            align="right" // Align the legend to the right
            verticalAlign="middle" // Align the legend vertically in the middle
          />
        </PieChart>
      </Flex>
    </Flex>
  );
}

export default DataAnalytic;
