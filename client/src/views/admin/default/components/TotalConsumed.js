// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import LineChart from "components/charts/LineChart";
import React, { useMemo } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
// Assets
import { RiArrowUpSFill } from "react-icons/ri";
import {
  lineChartOptionsTotalSpent,
} from "variables/charts";

export default function TotalConsumed(props) {
  const { ...rest } = props;

  // Chakra Color Mode

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
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

  var energyData = props.data

  // sort meterData by timestamp
  energyData.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.date) - new Date(b.date);
  });

  var kwh_data = []
  let lineChartOptions = lineChartOptionsTotalSpent
  lineChartOptions.xaxis.categories = []

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
    if (lineChartOptions.xaxis.categories.indexOf(d) == -1) {
      if (date.getMonth() == currentMonth) {
        lineChartOptions.xaxis.categories.push(d)
      }
    }

    kwh_data.push(energyData[i].total_consumed)

  }

  const myLineChartOptions = lineChartOptions;

  var dict = Object.create(null); // create an empty object

  var groupedByDate = energyData.reduce(function (arr, o) {
    var current = dict[o.date]; // get the object from dict

    if (!current) { // if dict doesn't contain object
      current = Object.assign({}, o); // create a clone of the object - this prevents changing the original object

      arr.push(current); // push it to the array

      dict[o.date] = current; // add it to dict
    } else { // if dict contains the object
      current.total_consumed += o.total_consumed; // update the sum
    }

    return arr;
  }, []);

  console.log(groupedByDate);


  /*let groupedCurrentMonth = []

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
    groupedData.push(Math.round(date.total_consumed))
  })


  let total_produced = 0
  let total_consumed = 0
  for (let i = 0; i < groupedByDate.length; i++) {
    total_consumed += groupedByDate[i].total_consumed
  }


  let options = []
  options.push({ name: "kwH", data: groupedData })

  const lineChartDataTotalSpent = useMemo(() => options);


  return (
    <Card
      justifyContent='center'
      align='center'
      direction='column'
      w='100%'
      mb='0px'
      {...rest}>
      <Text
        me='auto'
        color={textColor}
        fontSize='xl'
        fontWeight='700'
        lineHeight='100%'>
        Daily Consumed Electricity in kW
      </Text>
      <Flex justify='space-between' ps='0px' pe='20px' pt='5px'>
        <Flex align='center' w='100%'>
          <Button
            bg={boxBg}
            fontSize='sm'
            fontWeight='500'
            color={textColorSecondary}
            borderRadius='7px'>
            <Icon
              as={MdOutlineCalendarToday}
              color={textColorSecondary}
              me='4px'
            />
            This month
          </Button>
          <Button
            ms='auto'
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
      </Flex>
      <Flex w='100%' flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection='column' me='20px' mt='28px'>
          <Text
            color={textColor}
            fontSize='26px'
            textAlign='start'
            fontWeight='400'
            lineHeight='100%'>
            kW {Math.round(total_consumed)}
          </Text>
          <Flex align='center'>
            <Icon as={IoCheckmarkCircle} color='green.500' me='4px' />
            <Text color='green.500' fontSize='md' fontWeight='700'>
              On track
            </Text>
          </Flex>
        </Flex>
        <Box minH='260px' minW='75%' mt='auto' height='100%' overflowY={{ sm: "hidden" }}>
          <LineChart
            chartData={lineChartDataTotalSpent}
            chartOptions={myLineChartOptions}
          />
        </Box>
      </Flex>
    </Card>
  );
}
