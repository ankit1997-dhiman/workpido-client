"use client";
import useAuth from "@/hooks/useAuth";
import { API } from "@/lib/api";
import { COUNTRIES } from "@/lib/constants";
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
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const page = () => {
  const { avatarUrl, me, user } = useAuth();
  const { push } = useRouter();
  useEffect(() => {
    me();
  }, []);

  const Formik = useFormik({
    initialValues: {
      displayName: user?.displayName,
      profession: user?.profession,
      acceptingOrders: user?.acceptingOrders,
      country: user?.country,
      bio: user?.bio || "",
      defaultDashboard: user?.defaultDashboard || "seller",
      acceptingOrders: user?.acceptingOrders || true,
      skills: user?.skills || "",
    },
    onSubmit: async (values) => {
      try {
        await API.updateMe(values);
        toast.success("Profile update successfully!");
        me();
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
    }
  }, [user]);

  return (
    <>
      <Box w={"full"} minH={"90vh"} p={[4, 8, 12]}>
        <Text fontSize={["xl", "2xl"]} fontWeight={"bold"}>
          Edit Your Profile
        </Text>
        <br />
        <Stack
          direction={["column", "row"]}
          w={"full"}
          gap={8}
          alignItems={"flex-start"}
        >
          <Box w={["full", "xs"]}>
            <Image src={avatarUrl} boxSize={"xs"} objectFit={"cover"} />
            <HStack py={2} w={"full"} justifyContent={"center"}>
              <Button size={"sm"}>Change</Button>
              <Button size={"sm"} colorScheme="red">
                Remove
              </Button>
            </HStack>
          </Box>
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
            <FormControl w={["full", "full"]}>
              <FormLabel>Bio</FormLabel>
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
        </Stack>
        <br />
        <br />
        <br />
        <Stack
          direction={["column", "row"]}
          w={"full"}
          gap={8}
          alignItems={"flex-start"}
        >
          <FormControl w={["full", "sm"]}>
            <FormLabel>Profession</FormLabel>
            <Input
              name="profession"
              value={Formik.values.profession}
              onChange={Formik.handleChange}
              placeholder="eg, Graphic Designer"
            />
          </FormControl>
          <FormControl w={["full", "sm"]}>
            <FormLabel>Country</FormLabel>
            <Select
              name="country"
              value={Formik.values.country}
              onChange={(value) => Formik.setFieldValue("country", value)}
              defaultValue={Formik.values.country}
              options={COUNTRIES}
              useBasicStyles
            />
          </FormControl>
          <FormControl w={["full", "sm"]}>
            <FormLabel>Default Dashboard</FormLabel>
            <HStack py={2} w={"full"}>
              <Button
                size={"sm"}
                colorScheme={
                  Formik.values.defaultDashboard == "buyer" ? "twitter" : "gray"
                }
                onClick={() =>
                  Formik.setFieldValue("defaultDashboard", "buyer")
                }
              >
                Buyer Dashboard
              </Button>
              <Button
                size={"sm"}
                colorScheme={
                  Formik.values.defaultDashboard == "seller"
                    ? "twitter"
                    : "gray"
                }
                onClick={() =>
                  Formik.setFieldValue("defaultDashboard", "seller")
                }
              >
                Seller Dashboard
              </Button>
            </HStack>
          </FormControl>
          <FormControl w={["full", "sm"]}>
            <FormLabel>Are you accepting orders?</FormLabel>
            <HStack py={2} w={"full"}>
              <Button
                size={"sm"}
                colorScheme={
                  Formik.values.acceptingOrders == true ? "twitter" : "gray"
                }
                onClick={() => Formik.setFieldValue("acceptingOrders", true)}
              >
                Yes, I'm accepting orders
              </Button>
              <Button
                size={"sm"}
                colorScheme={
                  Formik.values.acceptingOrders == false ? "twitter" : "gray"
                }
                onClick={() => Formik.setFieldValue("acceptingOrders", false)}
              >
                No, I'm busy
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
      </Box>
      <br />
      <br />
      <HStack w={"full"} py={4} justifyContent={"center"}>
        <Button onClick={() => push("/profile/me")}>Back to Profile</Button>
        <Button colorScheme="twitter" onClick={Formik.handleSubmit}>
          Save Details
        </Button>
      </HStack>
    </>
  );
};

export default page;
