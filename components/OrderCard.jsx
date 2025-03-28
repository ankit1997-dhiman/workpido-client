import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { MdOutlineStickyNote2 } from "react-icons/md";

const OrderCard = ({ order }) => {
  return (
    <Flex
      w={"full"}
      className="mx-auto bg-white lg:rounded-none border rounded-lg flex-col lg:flex-row gap-2"
      border={'1px solid #DADADA'}
      px={3}
      py={[3, 0]}
    >
      {/* Name */}

      <Flex className="w-full lg:items-center lg:w-2/6">
        <Link
          href={`/order-details/${order?.orderId}`}
          className="hover:text-indigo-600 items-center"
        >
          {order?.gig?.title}
        </Link>
      </Flex>
      {/* Status */}
      <Flex className="w-full lg:w-1/6 gap-2 items-center justify-center flex-col lg:order-last">
        {order?.finishedAt ? (
          <Text className="text-xs text-neutral-500">
            {new Date(order?.finishedAt)?.toLocaleDateString()}
          </Text>
        ) : null}

        {order?.status == "cancelled" ? (
          <Box className="py-1 px-3 border border-red-700 rounded-md bg-red-700">
            <Text className="text-xs text-white font-medium">Canceled</Text>
          </Box>
        ) : (
          <Box className="py-1 px-2 border border-brand-primary rounded-md bg-brand-primary">
            <Text
              className="text-xs text-white font-medium"
              textTransform={"capitalize"}
            >
              {order?.status}
            </Text>
          </Box>
        )}
      </Flex>
      {/* Details */}
      <Flex className="items-center justify-evenly lg:w-3/6">
        {/* Buyer */}
        <Box className="items-center w-1/2 lg:px-2">
          <Link href={`/profile/${order?.buyer?.username}`}>
            <Stack my={4} direction={"row"} spacing={1} align={"center"}>
              <Avatar size={"sm"} src={order?.buyer?.avatar?.url} />
              <Text fontSize={"xs"}>{order?.buyer?.username}</Text>
            </Stack>
          </Link>
        </Box>
        {/* Note */}
        <Flex className="w-1/3 items-center justify-center">
          <MdOutlineStickyNote2 />
        </Flex>
        {/* Price */}
        <Box className="w-1/3 items-center">
          <Text className="text-center">{order?.amount}</Text>
        </Box>
      </Flex>
      {/* Review - only visible on smaller displays */}
      <Flex className="lg:w-1/6 lg:border-none lg:items-center justify-center border border-gray-700 rounded-md w-3/4 text-center my-1 py-1 mx-auto">
        {order?.status == "finished" || order?.status == "cancelled" ? (
          <Link href="/order-details">
            <Text className="font-medium">Read the Review</Text>
          </Link>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default OrderCard;
