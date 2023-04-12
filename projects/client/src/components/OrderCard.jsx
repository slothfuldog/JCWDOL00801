import React, { useEffect } from "react";
import {
  Card,
  Image,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  CardHeader,
  Flex,
  Tag,
  Icon,
  Select,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { AiOutlineUser } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

function OrderCard(props) {
  const { orderId, price, createdAt } = props.order;
  const { status, totalGuest, checkinDate, checkoutDate, transactionId } = props.transaction;
  const { tenant, name, image } = props.property;
  const [isReview, setIsReview] = React.useState();
  const navigate = useNavigate();

  const getReview = async () => {
    try {
      let response = await Axios.get(
        process.env.REACT_APP_API_BASE_URL + `/review/check?id=${transactionId}`
      );
      setIsReview(response.data.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReview();
  }, []);

  return (
    <Card overflow="hidden">
      <CardHeader pb="0">
        <Flex align="center" justifyContent="space-between">
          <Flex gap={3}>
            <Flex direction="row" gap={1}>
              <Heading size="xs" fontWeight="500">
                Booking Number:
              </Heading>
              <Heading size="xs">{orderId}</Heading>
            </Flex>
            <Flex direction="row" gap={1}>
              <Heading size="xs" fontWeight="500">
                Order Date
              </Heading>
              <Heading size="xs">{format(new Date(createdAt), "MMM dd, yy")}</Heading>
            </Flex>
          </Flex>
          <Flex align="center" gap={2}>
            <Flex direction="row" gap={1}>
              <Heading size="xs" fontWeight="500">
                Check In
              </Heading>
              <Heading size="xs">{format(new Date(checkinDate), "MMM dd, yy")}</Heading>
            </Flex>
            <Flex direction="row" gap={1}>
              <Heading size="xs" fontWeight="500">
                Check Out
              </Heading>
              <Heading size="xs">{format(new Date(checkoutDate), "MMM dd, yy")}</Heading>
            </Flex>
            <Tag
              size={"lg"}
              colorScheme={
                status === "Waiting for payment"
                  ? "orange"
                  : status === "Waiting for confirmation"
                  ? "blue"
                  : status === "Confirmed"
                  ? "green"
                  : status === "Cancelled"
                  ? "red"
                  : null
              }
            >
              {status}
            </Tag>
          </Flex>
        </Flex>
      </CardHeader>
      <Flex>
        <CardBody>
          <Flex gap={1}>
            <Icon as={AiOutlineUser} />
            <Heading size="xs" mb={2} textTransform="capitalize">
              {tenant.user.name}
            </Heading>
          </Flex>
          <Flex gap={3}>
            <Image
              boxSize="150px"
              src={process.env.REACT_APP_API_BASE_IMG_URL + image}
              fallbackSrc="https://via.placeholder.com/150"
            />
            <Flex direction="column">
              <Heading size="md">{name}</Heading>

              <Text py="2">{props.type.name}</Text>
              <Text py="2"># of guest: {totalGuest}</Text>
            </Flex>
          </Flex>
        </CardBody>
      </Flex>
      <CardFooter justify="end" pt="0">
        <Flex direction="column" gap={3} align="end">
          <Text color="blue.600" fontSize="2xl">
            {parseInt(price).toLocaleString("ID", { style: "currency", currency: "IDR" })}
          </Text>
          {status === "Waiting for payment" ? (
            <Select>
              <option hidden>Action</option>
              <option onClick={() => navigate(`/payment-proof?id=${transactionId}`)}>
                Proceed to payment
              </option>
              <option>Cancel</option>
            </Select>
          ) : status === "Confirmed" && new Date() > new Date(checkoutDate) ? (
            <Flex gap={3}>
              {isReview ? null : (
                <Button variant="outline" colorScheme="green">
                  {"Write a review"}
                </Button>
              )}
              <Button
                variant="solid"
                onClick={() => props.btnDetails(props.order)}
                colorScheme="green"
              >
                {"Details"}
              </Button>
            </Flex>
          ) : (
            <Button
              variant="solid"
              onClick={() => props.btnDetails(props.order)}
              colorScheme="green"
            >
              {"Details"}
            </Button>
          )}
        </Flex>
      </CardFooter>
    </Card>
  );
}

export default OrderCard;
