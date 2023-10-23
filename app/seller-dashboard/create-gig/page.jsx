"use client";
import GigAccordion from "@/components/GigAccordion";
import { API } from "@/lib/api";
import {
  Accordion,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  Textarea,
  Select,
  CheckboxGroup,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { AddCircle } from "iconsax-react";
import FileDropzone from "@/components/FileDropzone";

const CreateGig = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [attributes, setAttributes] = useState([]);

  const Formik = useFormik({
    initialValues: {
      title: "",
      category: "",
      subCategory: "",
      overview: "",
      description: "",
      services: [],
      attributes: [],
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await API.getAllCategories();
        setData(res);
        setCategories(
          res?.map((item) => ({ label: item?.title, value: item?.id }))
        );
      } catch (error) {
        toast.warn("Couldn't fetch categories");
      }
    })();
  }, []);

  useEffect(() => {
    setSubCategories([]);
    setServices([]);
    setAttributes([]);
    const filteredData = data
      ?.find((item) => item?.id == Formik.values.category)
      ?.subCategories?.map((item) => ({ label: item?.title, value: item?.id }));
    setSubCategories(filteredData);
  }, [Formik.values.category]);

  useEffect(() => {
    setServices([]);
    setAttributes([]);
    const filteredData = data
      ?.find((item) => item?.id == Formik.values.category)
      ?.subCategories?.find((item) => item?.id == Formik.values.subCategory)
      ?.services?.map((item) => ({ label: item?.title, value: `${item?.id}` }));
    setServices(filteredData);
  }, [Formik.values.subCategory]);

  useEffect(() => {
    setAttributes([]);
    const filteredData = data
      ?.find((item) => item?.id == Formik.values.category)
      ?.subCategories?.find((item) => item?.id == Formik.values.subCategory)
      ?.services?.map((item) => ({
        label: item?.title,
        value: item?.id,
        attributes: item?.serviceAttributes?.map((item) => ({
          label: item?.title,
          value: item?.id,
        })),
      }));
    setAttributes(filteredData);
  }, [Formik.values.services]);

  const onDrop = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles);
    Formik.setFieldValue("files", acceptedFiles);
    const newImages = acceptedFiles.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages)
      .then((imagePreviews) =>
        setSelectedImages((prevImages) => [...prevImages, ...imagePreviews])
      )
      .catch((error) => console.error("Error reading file:", error));
  }, []);

  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    Formik.setFieldValue(
      "files",
      Formik.values.files?.filter((_, i) => i !== index)
    );
  };

  const [selectedImages, setSelectedImages] = useState([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  return (
    <>
      <Box p={[4, 8, 12]}>
        <Text fontWeight={"bold"} fontSize={"2xl"}>
          Create New Gig
        </Text>
        <br />
        <br />

        <Box w={["full", "3xl", "4xl"]}>
          <Accordion allowMultiple>
            <GigAccordion step={1} title={"Title & Category"}>
              <Box py={4}>
                <FormControl py={2}>
                  <HStack alignItems={"flex-start"}>
                    <FormLabel flex={1}>Title</FormLabel>
                    <Textarea
                      flex={5}
                      noOfLines={2}
                      maxLength={70}
                      h={20}
                      fontSize={"xl"}
                      fontWeight={"medium"}
                      resize={"none"}
                      w={"full"}
                      placeholder="I will create a professional website..."
                    />
                  </HStack>
                </FormControl>
                <HStack alignItems={"flex-start"} py={4}>
                  <FormLabel flex={1}>Category</FormLabel>
                  <HStack gap={8} flex={5}>
                    <FormControl>
                      <Select
                        placeholder={"Select Category"}
                        name="category"
                        onChange={Formik.handleChange}
                        value={Formik.values.category}
                      >
                        {categories?.map((item, key) => {
                          return (
                            <option key={key} value={item.value}>
                              {item.label}
                            </option>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <Select
                        placeholder={"Select Sub Category"}
                        name="subCategory"
                        onChange={Formik.handleChange}
                        value={Formik.values.subCategory}
                      >
                        {subCategories?.map((item, key) => {
                          return (
                            <option key={key} value={item.value}>
                              {item.label}
                            </option>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </HStack>
                </HStack>

                {services?.length ? (
                  <FormControl py={4}>
                    <HStack>
                      <FormLabel flex={1}>Services</FormLabel>
                      <Box flex={5}>
                        <CheckboxGroup
                          defaultValue={[]}
                          colorScheme="teal"
                          onChange={(values) => {
                            Formik.setFieldValue("services", values);
                            console.log(values);
                          }}
                        >
                          <Stack
                            direction={["column", "row"]}
                            alignItems={"flex-start"}
                            justifyContent={"flex-start"}
                            gap={4}
                          >
                            {services?.map((service, key) => (
                              <Checkbox value={service?.value} key={key}>
                                {service?.label}
                              </Checkbox>
                            ))}
                          </Stack>
                        </CheckboxGroup>
                      </Box>
                    </HStack>
                  </FormControl>
                ) : null}

                {attributes?.length ? (
                  <FormControl py={4}>
                    <HStack>
                      <FormLabel flex={1}>Attributes</FormLabel>
                      <Box flex={5}>
                        <Stack
                          direction={["column", "row"]}
                          alignItems={"flex-start"}
                          justifyContent={"flex-start"}
                          gap={4}
                        >
                          {attributes?.map((attributeGroup, key) => (
                            <Box>
                              {attributeGroup?.attributes?.map(
                                (attribute, key) => (
                                  <Checkbox value={attribute?.value} key={key}>
                                    {attribute?.label}
                                  </Checkbox>
                                )
                              )}
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </HStack>
                  </FormControl>
                ) : null}
              </Box>
            </GigAccordion>

            <GigAccordion step={2} title={"Description & Files"}>
              <Box py={4}>
                <Box py={4}>
                  <Text pb={4} fontWeight={"semibold"}>
                    Upload Banner Images
                  </Text>
                  <FileDropzone />
                </Box>

                <Text fontWeight={"semibold"} py={4}>
                  Detailed Description
                </Text>
                <SunEditor height="520px" />

                <Box py={4}>
                  <Text pb={4} fontWeight={"semibold"}>
                    Upload Other Attachments (optional)
                  </Text>
                  <FileDropzone />
                </Box>
              </Box>
            </GigAccordion>

            <GigAccordion step={3} title={"Pricing"}>
              <Text>Text Inside Gig Accordion</Text>
            </GigAccordion>

            <GigAccordion step={4} title={"Frequently Asked Questions (FAQs)"}>
              <Text>Text Inside Gig Accordion</Text>
            </GigAccordion>
          </Accordion>
          <HStack w={"full"} justifyContent={"flex-end"} mt={8}>
            <Button>Cancel</Button>
            <Button isDisabled colorScheme="whatsapp">
              Submit for Review
            </Button>
          </HStack>
        </Box>
      </Box>
    </>
  );
};

export default CreateGig;
