/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/doi100.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useEffect, useState } from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
  MdFilePresent,
  MdPower
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
  columnsDataCheck,
  columnsDataComplex,
} from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import PropTypes from 'prop-types';
import jwt_decode from 'jwt-decode'
import { useHistory } from 'react-router-dom'


export default function UserReports() {

  const history = useHistory()
  const [loading, setLoading] = useState(true);
  const [energyData, setEnergyData] = useState([])
  const [meterData, setMeterData] = useState([])
  const [doiBalance, setDoiBalance] = useState([])

  const [tableDataComplex, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const user = jwt_decode(token)
      if (!user) {
        localStorage.removeItem('token')
        history.push('/auth')
      } else {
        (async () => {
          fetch("/admin/default",{ headers: {
            'x-access-token': localStorage.getItem('token'),
          },})
            .then((res) => res.json())
            .then((json) => {
              var meterData = []
              var readEnergyData = []
              for (let i = 0; i < json.length; i++) {
                if (json[i].booking_id !== undefined) {
                  for (let j = 0; j < json[i].energy.length; j++) {
                    readEnergyData.push(json[i].energy[j])
                  }
                }
                if (json[i].balance !== undefined) {
                  setDoiBalance(json[i].balance)
                  //json.splice(i, 1)
                }

                if (json[i].meterId !== undefined){
                  let date = new Date(json[i].timestamp)
                  meterData.push({
                    date: date,
                    total_produced: json[i].total_produced,
                    total_consumed: json[i].total_consumed
                  })
                }
              }

              setEnergyData(readEnergyData)
              setMeterData(meterData)
              setData(energyData);
              setLoading(false);
              console.log("result ", json)
            })
            .catch(error => {
              setLoading(false);
              console.log(error)
            })
        })();
      }
    }
  }, []);

  function calculateTotalEnergy(energyData) {
    let totalElectricityAmount = 0
    for (let i = 0; i < energyData.length; i++) {
      totalElectricityAmount += energyData[i].energy_kwh
    }
    return `${totalElectricityAmount} kwH`
  }


  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  if (loading) {
    return null
  } else {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
          gap='20px'
          mb='20px'>
          <MiniStatistics
            startContent={
              <IconBox
                w='56px'
                h='56px'
                bg={boxBg}
                icon={
                  <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
                }
              />
            }
            name='Earnings'
            value='$350.4'
          />
          <MiniStatistics
            startContent={
              <IconBox
                w='56px'
                h='56px'
                bg={boxBg}
                icon={
                  <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
                }
              />
            }
            name='Spend this month'
            value='$642.39'
          />
          <MiniStatistics growth='+23%' name='Sales' value='$574.34' />
          <MiniStatistics
            endContent={
              <Flex me='-16px' mt='10px'>
                <FormLabel htmlFor='balance'>
                  <Avatar src={Usa} />
                </FormLabel>
                <Select
                  id='balance'
                  variant='mini'
                  mt='5px'
                  me='0px'
                  defaultValue='usd'>
                  <option value='usd'>USD</option>
                  <option value='eur'>EUR</option>
                  <option value='gba'>GBA</option>
                </Select>
              </Flex>
            }
            name='Your DoiWallet balance'
            value={doiBalance}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w='56px'
                h='56px'
                bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
                icon={<Icon w='28px' h='28px' as={MdPower} color='white' />}
              />
            }
            name='Total Booked Electricity'
            value={calculateTotalEnergy(energyData)}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w='56px'
                h='56px'
                bg={boxBg}
                icon={
                  <Icon w='32px' h='32px' as={MdFilePresent} color={brandColor} />
                }
              />
            }
            name='Total Electricity Bookings'
            value={tableDataComplex.length}
          />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px' >
          <WeeklyRevenue data={meterData} />
          <TotalSpent />
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='40px' mb='40px'>
          <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
            <PieCard />
            <MiniCalendar h='100%' minW='100%' selectRange={false} />
          </SimpleGrid>
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px' >
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
            <Tasks />
            <DailyTraffic />
          </SimpleGrid>
        </SimpleGrid>
      </Box>
    );
  }
}

UserReports.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});