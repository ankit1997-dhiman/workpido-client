"use client";
import useAuth from "@/hooks/useAuth";
import { API } from "@/lib/api";
import { CLIENT_BASE_URL, COUNTRIES } from "@/lib/constants";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  Stack,
  Text,
  Textarea,
  Select as ChakraSelect,
  Container,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Link from "next/link";

const EditProfile = () => {
  const { avatarUrl, me, user } = useAuth();
  const { push } = useRouter();

  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    me();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.getCurrencies();
        setCurrencies(res?.data);
      } catch (error) {
        console.log("Error fetching currencies");
        console.log(error);
      }
    })();
  }, []);

  const Formik = useFormik({
    initialValues: {
      username: user?.username,
      phone: user?.phone,
      email: user?.email,
      displayName: user?.displayName,
      profession: user?.profession,
      acceptingOrders: user?.acceptingOrders,
      country: user?.country,
      bio: user?.bio || "",
      defaultDashboard: user?.defaultDashboard || "seller",
      acceptingOrders: user?.acceptingOrders || true,
      skills: user?.skills || "",
      currency: user?.currency || "",
    },
    onSubmit: async (values) => {
      try {
        await API.updateMe({ ...values, country: values?.country?.value });
        toast.success("Profile update successfully!");
        // me();
        push("/profile/me");
      } catch (error) {
        console.log(error);
        toast.error("Couldn't update profile");
      }
    },
  });

  useEffect(() => {
    if (user?.id) {
      Formik.setFieldValue("displayName", user?.displayName);
      Formik.setFieldValue("profession", user?.profession);
      Formik.setFieldValue("country", user?.country);
      Formik.setFieldValue("bio", user?.bio);
      Formik.setFieldValue("defaultDashboard", user?.defaultDashboard);
      Formik.setFieldValue("skills", user?.skills);
      Formik.setFieldValue("currency", user?.currency?.id);
    }
  }, [user]);

  return (
    <>
      <Container
        maxW={["full", "3xl", "5xl", "7xl"]}
        my={[4, 8, 12]}
        minH={"90vh"}
      >
        <Text fontSize={["xl", "2xl", "3xl"]} fontWeight={"medium"} mb={8}>
          Settings
        </Text>

        <Tabs colorScheme="yellow" maxW={["full", "2xl"]}>
          <TabList>
            <Tab>General</Tab>
            <Tab>Profile</Tab>
            <Tab>Withdrawal Methods</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box p={4} bgColor={"#FFF"} rounded={4} boxShadow={"base"}>
                <Stack
                  direction={["column", "row"]}
                  alignItems={"center"}
                  justifyContent={"flex-start"}
                >
                  <Text>Your profile link - </Text>
                  <Link href={CLIENT_BASE_URL + `/profile/${user?.username}`}>
                    <Text color={"twitter.600"}>
                      {CLIENT_BASE_URL + `/profile/${user?.username}`}
                    </Text>
                  </Link>
                </Stack>
                <br />
                <FormControl pb={8}>
                  <FormLabel fontSize={"sm"}>Username</FormLabel>
                  <Input
                    placeholder="Your Username (All lower case, without spaces or special charachters)"
                    name="username"
                    value={Formik.values.username}
                    onChange={Formik.handleChange}
                  />
                </FormControl>
                <FormControl pb={8} w={["full", "xs"]}>
                  <FormLabel fontSize={"sm"}>Phone Number</FormLabel>
                  <Input
                    placeholder="Phone No."
                    type="tel"
                    name="phone"
                    value={Formik.values.phone}
                    onChange={Formik.handleChange}
                  />
                </FormControl>
                <FormControl pb={8} w={["full"]}>
                  <FormLabel fontSize={"sm"}>Email</FormLabel>
                  <Input
                    placeholder="Your Email"
                    type="email"
                    name="email"
                    value={Formik.values.email}
                    onChange={Formik.handleChange}
                  />
                </FormControl>
                <HStack gap={6}>
                  <FormControl pb={8} w={["full"]}>
                    <FormLabel fontSize={"sm"}>New Password</FormLabel>
                    <Input name="newPassword" placeholder="New Password" />
                  </FormControl>
                  <FormControl pb={8} w={["full"]}>
                    <FormLabel fontSize={"sm"}>Confirm Password</FormLabel>
                    <Input
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      type="password"
                    />
                  </FormControl>
                </HStack>
                <br />
                <HStack w={"full"} justifyContent={"flex-end"}>
                  <Button
                    onClick={() => push("/profile/me")}
                    fontSize={"sm"}
                    fontWeight={"normal"}
                  >
                    Back to Profile
                  </Button>
                  <Button
                    colorScheme="yellow"
                    onClick={Formik.handleSubmit}
                    fontSize={"sm"}
                    fontWeight={"normal"}
                  >
                    Save Details
                  </Button>
                </HStack>
              </Box>
            </TabPanel>
            <TabPanel>
              <Box p={4} bgColor={"#FFF"} rounded={4} boxShadow={"base"}>
                <Box w={"full"}>
                  <FormControl w={["full", "sm"]}>
                    <FormLabel>Display Name</FormLabel>
                    <Input
                      name="displayName"
                      value={Formik.values.displayName}
                      onChange={Formik.handleChange}
                      placeholder="Eg, Akshay Singh or SEO Blade Agency"
                    />
                  </FormControl>
                  <br />
                  <Box w={["full", "xs"]}>
                    <Image
                      src={avatarUrl}
                      width={48}
                      height={48}
                      objectFit={"contain"}
                    />
                    <HStack py={2} w={"full"} justifyContent={"flex-start"}>
                      <Button
                        variant={"ghost"}
                        size={"sm"}
                        colorScheme="twitter"
                      >
                        Change
                      </Button>
                      <Button variant={"ghost"} size={"sm"} colorScheme="red">
                        Remove
                      </Button>
                    </HStack>
                  </Box>
                  <br />
                  <FormControl w={["full", "full"]}>
                    <FormLabel>About Yourself</FormLabel>
                    <Textarea
                      placeholder="Tell us something about yourself..."
                      h={"48"}
                      resize={"none"}
                      name="bio"
                      value={Formik.values.bio}
                      onChange={Formik.handleChange}
                    />
                  </FormControl>
                </Box>
                <br />
                <br />
                <br />
                <Stack
                  direction={["column", "row"]}
                  w={"full"}
                  gap={8}
                  alignItems={"flex-start"}
                >
                  <FormControl w={["full"]}>
                    <FormLabel>What do you do?</FormLabel>
                    <Input
                      name="profession"
                      value={Formik.values.profession}
                      onChange={Formik.handleChange}
                      placeholder="eg, Graphic Designer"
                    />
                  </FormControl>
                </Stack>
                <br />
                <br />
                <Stack
                  direction={["column", "row"]}
                  w={"full"}
                  gap={8}
                  alignItems={"flex-start"}
                >
                  <FormControl w={["full", "sm"]}>
                    <FormLabel>Country</FormLabel>
                    <Select
                      name="country"
                      value={COUNTRIES.find(
                        (country) => country.value == Formik.values.country
                      )}
                      onChange={(value) =>
                        Formik.setFieldValue("country", value)
                      }
                      options={COUNTRIES}
                      useBasicStyles
                    />
                  </FormControl>
                  <FormControl w={["full", "sm"]}>
                    <FormLabel>Currency</FormLabel>
                    <ChakraSelect
                      name="currency"
                      value={Formik.values.currency}
                      onChange={Formik.handleChange}
                      isDisabled={Boolean(user?.currency)}
                      placeholder="Please select"
                    >
                      {currencies?.map((currency, key) => (
                        <option value={currency?.id} key={key}>
                          {currency?.attributes?.isoCode} (
                          {currency?.attributes?.symbol})
                        </option>
                      ))}
                    </ChakraSelect>
                  </FormControl>
                </Stack>
                <br />
                <br />
                <Stack
                  direction={["column", "row"]}
                  w={"full"}
                  gap={8}
                  alignItems={"flex-start"}
                >
                  <FormControl w={["full", "sm"]}>
                    <FormLabel>Default Dashboard</FormLabel>
                    <HStack
                      rounded={4}
                      overflow={"hidden"}
                      mb={4}
                      gap={0}
                      border={"0.5px solid #e2e2e2"}
                    >
                      <Button
                        size={"sm"}
                        bgColor={
                          Formik.values.defaultDashboard == "buyer"
                            ? "#177de5"
                            : "transparent"
                        }
                        flex={1}
                        _hover={"none"}
                        color={
                          Formik.values.defaultDashboard == "buyer"
                            ? "#FFF"
                            : "#000"
                        }
                        onClick={() =>
                          Formik.setFieldValue("defaultDashboard", "buyer")
                        }
                        rounded={0}
                        fontWeight={"normal"}
                        fontSize={"sm"}
                      >
                        Buyer
                      </Button>
                      <Button
                        size={"sm"}
                        bgColor={
                          Formik.values.defaultDashboard == "seller"
                            ? "#177de5"
                            : "transparent"
                        }
                        flex={1}
                        _hover={"none"}
                        color={
                          Formik.values.defaultDashboard == "seller"
                            ? "#FFF"
                            : "#000"
                        }
                        onClick={() =>
                          Formik.setFieldValue("defaultDashboard", "seller")
                        }
                        rounded={0}
                        fontWeight={"normal"}
                        fontSize={"sm"}
                      >
                        Seller
                      </Button>
                    </HStack>
                  </FormControl>

                  <FormControl w={["full", "sm"]}>
                    <FormLabel>Are you accepting orders?</FormLabel>
                    <HStack
                      rounded={4}
                      overflow={"hidden"}
                      mb={4}
                      gap={0}
                      border={"0.5px solid #e2e2e2"}
                    >
                      <Button
                        size={"sm"}
                        bgColor={
                          Formik.values.acceptingOrders
                            ? "#177de5"
                            : "transparent"
                        }
                        flex={1}
                        _hover={"none"}
                        color={Formik.values.acceptingOrders ? "#FFF" : "#000"}
                        onClick={() =>
                          Formik.setFieldValue("acceptingOrders", true)
                        }
                        rounded={0}
                        fontWeight={"normal"}
                        fontSize={"sm"}
                      >
                        Yes
                      </Button>
                      <Button
                        size={"sm"}
                        bgColor={
                          Formik.values.acceptingOrders == false
                            ? "#177de5"
                            : "transparent"
                        }
                        flex={1}
                        _hover={"none"}
                        color={
                          Formik.values.acceptingOrders == false
                            ? "#FFF"
                            : "#000"
                        }
                        onClick={() =>
                          Formik.setFieldValue("acceptingOrders", false)
                        }
                        rounded={0}
                        fontWeight={"normal"}
                        fontSize={"sm"}
                      >
                        No
                      </Button>
                    </HStack>
                  </FormControl>
                </Stack>
                <br />
                <br />
                <br />
                <FormControl w={["full"]}>
                  <FormLabel>Skills</FormLabel>
                  <Input
                    name="skills"
                    value={Formik.values.skills}
                    onChange={Formik.handleChange}
                    placeholder="write each skill separated by a comma like - Graphic Designing, Web Development, Canva, SEO Analysis"
                  />
                </FormControl>

                <br />
                <br />
                <HStack w={"full"} justifyContent={"flex-end"}>
                  <Button
                    onClick={() => push("/profile/me")}
                    fontSize={"sm"}
                    fontWeight={"normal"}
                  >
                    Back to Profile
                  </Button>
                  <Button
                    colorScheme="yellow"
                    onClick={Formik.handleSubmit}
                    fontSize={"sm"}
                    fontWeight={"normal"}
                  >
                    Save Details
                  </Button>
                </HStack>
              </Box>
            </TabPanel>
            <TabPanel>
              <p>Withdrawal</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
};

export default EditProfile;
