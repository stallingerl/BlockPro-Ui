import {
  Flex,
  Table,
  Progress,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

// Custom components
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";

// Assets
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
export default function ColumnsTable(props) {
  const { columnsData, tableData } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = tableData;
  let dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };

  function convertFromStringToDate(orbitDate) {
    let date = new Date(orbitDate);
    var userTimezoneOffset = date.getTimezoneOffset() * 60000;
    var d = new Date(date.getTime() - userTimezoneOffset);
    d = d.toLocaleString()
    return d
  }

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 5;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  return (
    <Card
      direction='column'
      w='100%'
      px='px'
      overflowX={{ sm: "scroll" }}
    >
      <Flex px='25px' justify='space-between' mb='10px' align='center' >
        <Text
          color={textColor}
          fontSize='22px'
          fontWeight='700'
          lineHeight='100%'>
          Testbuchungen von Energie Dock
        </Text>
        <Menu />
      </Flex>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px' w='100%' whiteSpace="nowrap">
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index} >
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}
                  w='100%'
                >
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'
                    w='100%'
                  >
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()} >
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index} w='100%'  >
                {row.cells.map((cell, index) => {
                  let data = ""
                  if (cell.column.Header !== "Booked Energy") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>)
                  }
                  else {
                    {
                      let tdata = ""
                      cell.value.forEach((element) => {
                        tdata = (
                          <Tr color={textColor} fontSize='sm' fontWeight='700' p="-0.5">
                            <Td>
                              {convertFromStringToDate(element.date)}
                            </Td>
                            <Td>
                              {element.energy_kwh} kwH
                            </Td>
                          </Tr>
                        )
                      })
                      data = (
                        <Table>
                          <Tbody>
                            {tdata}
                          </Tbody>
                        </Table>
                      )
                    }
                  }


                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      maxH='30px !important'
                      py='8px'
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor='transparent'>
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Card>
  );
}
