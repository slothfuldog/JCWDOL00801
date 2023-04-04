import React, { useEffect } from "react";
import { Button, Flex, Heading, Input, Divider, Center } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Switch,
  FormControl,
  FormLabel,
  Select,
  Text,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { Select as Select2 } from "chakra-react-select";

function RoomList(props) {
  const navigate = useNavigate();
  const [roomData, setRoomData] = React.useState([]);
  const toast = useToast();
  const { tenantId } = useSelector((state) => {
    return {
      tenantId: state.tenantReducer.tenantId,
    };
  });
  const [city, setCity] = React.useState([]);
  const [filterName, setFilterName] = React.useState("");
  const [filterCity, setFilterCity] = React.useState("");
  const [filterAddress, setFilterAddress] = React.useState("");
  const [sortData, setSortData] = React.useState("");
  const [typeOption, setTypeOption] = React.useState([]);
  const [desc, setDesc] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(0);
  const [pages, setPages] = React.useState(0);
  const [rows, setRows] = React.useState(0);
  const [pageMessage, setPageMessage] = React.useState("");
  const [searchName, setSearchName] = React.useState("");
  const [searchCity, setSearchCity] = React.useState("");
  const [searchAddress, setSearchAddress] = React.useState("");

  const getRoomData = async () => {
    let endpoint = [`/rooms/all?tenant=${tenantId}&limit=${limit}&page=${page}&`];
    let reqQuery = [];
    if (sortData !== "") {
      if (desc) {
        reqQuery.push(`sortby=${sortData}&order=desc`);
      } else {
        reqQuery.push(`sortby=${sortData}`);
      }
    }
    if (filterName !== "") {
      reqQuery.push(`name=${filterName}`);
    }
    if (filterCity !== "") {
      reqQuery.push(`type=${filterCity}`);
    }
    if (filterAddress !== "") {
      reqQuery.push(`price=${filterAddress}`);
    }
    try {
      let response = await Axios.get(
        process.env.REACT_APP_API_BASE_URL + endpoint + reqQuery.join("&")
      );
      setRoomData(response.data.data);
      setPage(response.data.page);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
      setTypeOption(response.data.types);
      
    } catch (error) {
      console.log(error);
    }
  };

  const getCityData = async () => {
    try {
      let response = await Axios.get(process.env.REACT_APP_API_BASE_URL + `/category/${tenantId}`);
      setCity(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const renderOption = () =>{
    if(typeOption.length > 0){
      return typeOption.map((val, idx) => {
        return (
          <option
            value={val.typeId}
            key={idx}
          >{`${val.name}`}</option>
        );
      })
    }
  }
  const renderRoomData = () => {
    if (roomData.length === 0) {
      return (
        <Tr>
          <Td colSpan="5">
            <Text fontSize="lg" align="center">
              DATA NOT FOUND
            </Text>
          </Td>
        </Tr>
      );
    }
    return roomData.map((room, idx) => {
      const { name , price, typeImg} = room.type;
      const {isDeleted} = room
      return (
        <Tr key={idx}>
          <Td>
            <Flex mr={5} pr={5} align="center" gap={3}>
              <Image
                rounded={5}
                boxSize={{ base: "50px", md: "65px" }}
                src={process.env.REACT_APP_API_BASE_IMG_URL + typeImg}
              />
              <Text>{name}</Text>
            </Flex>
          </Td>
          <Td>{room.property.name}</Td>
          <Td whiteSpace={{ base: "nowrap", md: "normal" }}>
            <Text noOfLines={1}>{parseInt(price).toLocaleString("ID", {style: "currency", currency: "IDR"})}</Text>
          </Td>
          <Td>
            <Switch
              isChecked={!isDeleted}
              colorScheme="green"
              onChange={() => onBtnSwitch(room.roomId, isDeleted)}
            />
          </Td>
          <Td>
            <Button onClick={() => navigate(`/room/edit?${room.roomId}`, {state: {roomId: room.roomId}})} colorScheme="green">
              Edit
            </Button>
          </Td>
        </Tr>
      );
    });
  };

  const onBtnSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setFilterName(searchName);
    setFilterCity(searchCity);
    setFilterAddress(searchAddress);
  };

  const handleSort = (data) => {
    setSortData(data);
    setDesc(!desc);
  };

  const onBtnSwitch = async (id, isDeleted) => {
    let changeStatus = !isDeleted;
    if (!isDeleted) {
      Swal.fire({
        title: "Are you sure you want to set this property as not active?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#38A169",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            let response = await Axios.patch(
              process.env.REACT_APP_API_BASE_URL + `/rooms/update/${id}`,
              {
                isDeleted: changeStatus,
              }
            );
            if (response.data.success) {
              toast({
                title: response.data.message,
                status: "success",
                isClosable: true,
                duration: 2500,
                position: "top",
              });
              getRoomData();
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    } else {
      try {
        let response = await Axios.patch(
          process.env.REACT_APP_API_BASE_URL + `/rooms/update/${id}`,
          {
            isDeleted: changeStatus,
          }
        );
        if (response.data.success) {
          toast({
            title: response.data.message,
            status: "success",
            isClosable: true,
            duration: 2500,
            position: "top",
          });
          getRoomData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onBtnReset = () => {
    setFilterAddress("");
    setFilterName("");
    setFilterCity("");
    setSearchName("");
    setSearchAddress("");
    setSearchCity("");
    setSortData("");
    getRoomData();
  };

  const onPageChange = ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setPageMessage(
        `If you can't find the data you're looking for, please try using a more specific keyword`
      );
    } else {
      setPageMessage("");
    }
  };

  useEffect(() => {
    getCityData();
  }, []);

  useEffect(() => {
    getRoomData();
  }, [page, filterAddress, filterCity, filterName, desc]);

  return (
    <Flex direction="column">
      <Flex direction={{ base: "column", lg: "row" }} gap={6} mt="10" mb={6}>
        <Flex direction="column" gap={6}>
          <Button
            colorScheme="green"
            variant="outline"
            onClick={() => {
              navigate("/room/new", { replace: true });
            }}
          >
            <AddIcon boxSize={3} mr={2} />
            Add New Room
          </Button>
          <Heading size="md">Search by</Heading>
          <Flex direction="column" gap={3}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select
                name="city"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Select Type"
              >
                {renderOption()}
              </Select>
            </FormControl>
          </Flex>
          <Flex justify="space-between" gap={3}>
            <Button onClick={onBtnReset} colorScheme="green" variant="ghost">
              Reset
            </Button>
            <Button onClick={onBtnSearch} colorScheme="green">
              Search
            </Button>
          </Flex>
        </Flex>
        <Center>
          <Divider orientation="vertical" />
        </Center>
        <TableContainer width="100%">
          <Flex mb={4} gap={3}>
            Sort By:
            <Button
              colorScheme="green"
              variant="link"
              onClick={() => {
                handleSort("name");
              }}
            >
              Name
            </Button>
            <Button
              colorScheme="green"
              variant="link"
              onClick={() => {
                handleSort("price");
              }}
            >
              Price
            </Button>
          </Flex>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>Property</Th>
                <Th>Price</Th>
                <Th>Active</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>{renderRoomData()}</Tbody>
            <TableCaption>
              <Flex>
                <Text>
                  Page: {rows ? page + 1 : 0} of {pages}
                </Text>
              </Flex>
            </TableCaption>
          </Table>
        </TableContainer>
      </Flex>
      <Flex justify="center">
        <Text>{pageMessage}</Text>
        <nav key={rows}>
          <ReactPaginate
            previousLabel={
              <IconButton
                isDisabled={page === 0}
                variant="outline"
                colorScheme="green"
                icon={<ArrowLeftIcon />}
              />
            }
            nextLabel={
              <IconButton
                isDisabled={page + 1 === pages || !rows}
                variant="outline"
                colorScheme="green"
                icon={<ArrowRightIcon />}
              />
            }
            pageCount={Math.min(10, pages)}
            onPageChange={onPageChange}
            containerClassName={"pagination-container"}
            pageLinkClassName={"pagination-link"}
            previousLinkClassName={"pagination-prev"}
            nextLinkClassName={"pagination-next"}
            activeLinkClassName={"pagination-link-active"}
            disabledLinkClassName={"pagination-link-disabled"}
          />
        </nav>
      </Flex>
    </Flex>
  );
}

export default RoomList;