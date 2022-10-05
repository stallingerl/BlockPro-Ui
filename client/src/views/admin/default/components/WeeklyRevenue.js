// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
// Custom components
import BarChart from "components/charts/BarChart";
import React, { useMemo } from "react";
import {
  barChartOptionsConsumption,
} from "variables/charts";
import { MdBarChart } from "react-icons/md";

export default function WeeklyRevenue(props) {
  const { ...rest } = props;
  var energyData = props.data

  // sort meterData by timestamp
  energyData.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.date) - new Date(b.date);
  });

  var kwh_data = []
  let barChartOptions = barChartOptionsConsumption

  let today = new Date()
  let currentMonth = today.getMonth()

  for (let i = 0; i < energyData.length; i++) {
    let date = new Date(energyData[i].date);
    let d = date.toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    energyData[i].date = d
    if (barChartOptions.xaxis.categories.indexOf(d) == -1) {
      if (date.getMonth() == currentMonth) {
        barChartOptions.xaxis.categories.push(d)
      }
    }
    kwh_data.push(energyData[i].total_produced)

  }

  const myBarChartOptions = barChartOptions;

  var dict = Object.create(null); // create an empty object

  var groupedByDate = energyData.reduce(function (arr, o) {
    var current = dict[o.date]; // get the object from dict

    if (!current) { // if dict doesn't contain object
      current = Object.assign({}, o); // create a clone of the object - this prevents changing the original object

      arr.push(current); // push it to the array

      dict[o.date] = current; // add it to dict
    } else { // if dict contains the object
      current.total_produced += o.total_produced; // update the sum
    }

    return arr;
  }, []);

  console.log(groupedByDate);

  /*
  let groupedCurrentMonth = []

  for (let i = 0; i < groupedByDate.length; i++) {
    let date = new Date(groupedByDate[i].date)
    let monthOfCurrentDate = date.getMonth()
    if (monthOfCurrentDate == currentMonth) {
      groupedCurrentMonth.push(groupedByDate[i])
    }
  }
  */ 

  let groupedData = []

  groupedByDate.forEach((date) => {
    groupedData.push(Math.round(date.total_produced))
  })

  let options = []
  options.push({ name: "kW", data: groupedData })

  const myBarChartData = useMemo(() => options);

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  return (
    <Card align='center' direction='column' w='100%' {...rest}>
      <Flex align='center' w='100%' px='15px' py='10px'>
        <Text
          me='auto'
          color={textColor}
          fontSize='xl'
          fontWeight='700'
          lineHeight='100%'>
          Daily Produced Electricity in kW
        </Text>
        <Button
          align='center'
          justifyContent='center'
          bg={bgButton}
          _hover={bgHover}
          _focus={bgFocus}
          _active={bgFocus}
          w='37px'
          h='37px'
          lineHeight='100%'
          borderRadius='10px'
          {...rest}>
          <Icon as={MdBarChart} color={iconColor} w='24px' h='24px' />
        </Button>
      </Flex>

      <Box h='100%' mt='auto' overflowY={{ sm: "hidden" }}>
        <BarChart
          chartData={myBarChartData}
          chartOptions={myBarChartOptions}
        />
      </Box>
    </Card>
  );
}
