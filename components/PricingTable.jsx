"use client";
import {
  Box,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Editable,
  EditablePreview,
  EditableInput,
  HStack,
  IconButton,
  Button,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";

const EditableData = ({ defaultValue, onChange, isViewOnly }) => {
  const [data, setData] = useState(defaultValue);

  return (
    <>
      {isViewOnly ? (
        <Text>{defaultValue}</Text>
      ) : (
        <Editable
          value={data}
          onChange={(value) => setData(value)}
          w={"full"}
          onBlur={() => onChange(data)}
        >
          <EditablePreview w={"full"} />
          <EditableInput w={"full"} />
        </Editable>
      )}
    </>
  );
};

const PricingTable = ({ data, totalPlans, size, onUpdate, isViewOnly }) => {
  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    console.log(totalPlans);
    console.log(typeof totalPlans);
    if (data) {
      setTableData(data);
      return;
    }
    if (totalPlans != tableData?.plans?.length) {
      console.log(new Array(totalPlans).fill("Your Plan Name"));

      setTableData({
        plans: new Array(totalPlans).fill("Your Plan Name"),
        attributes: ["Attribute Name"],
        data: {
          "Attribute Name": new Array(totalPlans).fill("Value"),
        },
      });
    }
  }, [data, totalPlans]);

  function handleDataUpdate({
    propertyToUpdate,
    index,
    data,
    parentAttribute,
  }) {
    // Make a copy of the current tableData
    const updatedTableData = { ...tableData };

    if (propertyToUpdate !== "data") {
      // Ensure that the propertyToUpdate exists in the updatedTableData
      if (!updatedTableData[propertyToUpdate]) {
        updatedTableData[propertyToUpdate] = [];
      }

      const existingAttributeName = tableData.attributes[index];

      if (propertyToUpdate == "attributes" && existingAttributeName != data) {
        let existingData = tableData.data[existingAttributeName];
        updatedTableData.data[data] = existingData;
        delete updatedTableData.data[existingAttributeName];
      }

      // Ensure that the index is within bounds
      if (index >= 0 && index < updatedTableData[propertyToUpdate].length) {
        updatedTableData[propertyToUpdate][index] = data;
      }
    } else {
      // Ensure that the parentAttribute exists in the updatedTableData.data
      if (!updatedTableData.data[parentAttribute]) {
        updatedTableData.data[parentAttribute] = [];
      }

      // Ensure that the index is within bounds
      if (index >= 0 && index < updatedTableData.data[parentAttribute].length) {
        updatedTableData.data[parentAttribute][index] = data;
      }
    }

    // Log the updates to ensure that data is being modified correctly
    console.log("Updated Data:");
    console.log(updatedTableData);

    // Update the state with the updatedTableData
    setTableData(updatedTableData);
  }

  function handleRowAdd(clickedAttribute) {
    // If no specific attribute is provided, add a row at the end
    if (!clickedAttribute) {
      const newAttribute = `NewAttribute_${Date.now()}`; // Generates a unique name
      const dummyValues = new Array(tableData.plans.length).fill("DummyValue");

      // Create a copy of the existing tableData
      const updatedTableData = { ...tableData };

      // Insert the new attribute and its corresponding data at the end in the copy
      updatedTableData.attributes.push(newAttribute);
      updatedTableData.data[newAttribute] = [...dummyValues];

      // Set the updated tableData state
      setTableData(updatedTableData);
      return;
    }

    // Find the index of the clicked attribute
    const attributeIndex = tableData.attributes.indexOf(clickedAttribute);

    if (attributeIndex !== -1) {
      // Create a new attribute with a unique name and an array of dummy values
      const newAttribute = `NewAttribute_${Date.now()}`; // Generates a unique name
      const dummyValues = new Array(tableData.plans.length).fill("DummyValue");

      // Create a copy of the existing tableData
      const updatedTableData = { ...tableData };

      // Insert the new attribute and its corresponding data right after the clicked attribute in the copy
      updatedTableData.attributes.splice(attributeIndex + 1, 0, newAttribute);
      updatedTableData.data[newAttribute] = [...dummyValues];

      // Set the updated tableData state
      setTableData(updatedTableData);
    }
  }

  function handleRowDelete(attributeToDelete) {
    // Create a copy of the existing tableData
    const updatedTableData = { ...tableData };

    // Find the index of the attribute to delete
    const attributeIndex =
      updatedTableData.attributes.indexOf(attributeToDelete);

    // Remove the attribute and its corresponding data from the copy
    updatedTableData.attributes.splice(attributeIndex, 1);
    delete updatedTableData.data[attributeToDelete];

    // Set the updated tableData state
    setTableData(updatedTableData);
  }

  useEffect(() => {
    onUpdate(tableData);
  }, [tableData]);

  return (
    <>
      <Box>
        <TableContainer>
          <Table size={size || "sm"} variant={"striped"}>
            <Thead bgColor={"yellow.300"}>
              <Tr>
                <Th>#</Th>
                {tableData?.plans?.map((data, key) => (
                  <Th key={key}>
                    <EditableData
                      isViewOnly={isViewOnly}
                      defaultValue={data}
                      onChange={(data) =>
                        handleDataUpdate({
                          propertToUpdate: "plans",
                          index: key,
                          data: data,
                        })
                      }
                    />
                  </Th>
                ))}
              </Tr>
            </Thead>

            <Tbody>
              {tableData?.attributes?.map((attribute, i) => (
                <Tr key={i}>
                  <Td>
                    <EditableData
                      isViewOnly={isViewOnly}
                      defaultValue={attribute}
                      onChange={(data) =>
                        handleDataUpdate({
                          propertyToUpdate: "attributes",
                          index: i,
                          data: data,
                        })
                      }
                    />
                  </Td>

                  {tableData?.data[attribute]?.map((data, key) => (
                    <Td key={key}>
                      <EditableData
                        isViewOnly={isViewOnly}
                        defaultValue={data ?? ""}
                        onChange={(data) =>
                          handleDataUpdate({
                            propertyToUpdate: "data",
                            index: key,
                            data: data,
                            parentAttribute: attribute,
                          })
                        }
                      />
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {isViewOnly ? null : (
          <HStack justifyContent={"flex-end"} py={4}>
            <Button
              size={"xs"}
              colorScheme="red"
              onClick={() =>
                handleRowDelete(
                  tableData?.attributes[tableData?.attributes?.length - 1]
                )
              }
            >
              Delete Last Row
            </Button>
            <Button
              size={"xs"}
              colorScheme="whatsapp"
              onClick={() => handleRowAdd()}
            >
              Add New Row
            </Button>
          </HStack>
        )}
      </Box>
    </>
  );
};

export default PricingTable;
