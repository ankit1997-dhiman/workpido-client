import React, { useState } from "react";
import AppModal from "./AppModal";
import { Heading, Stack, Text, Box, Button } from "@chakra-ui/react";
import { redirect, useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { API } from "@/lib/api";
import Input from "./Input";
import { toast } from "react-toastify";
const SignupSchema = Yup.object().shape({
  identifier: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Password is required"),
});

const SigninModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (values, { setSubmitting, setFieldError }) => {
    API.login(values)
      .then((response) => {
        toast.success("Signin successful");
        console.log("hehehe", response);
        localStorage.setItem("token", response.jwt);
        localStorage.setItem("user", JSON.stringify(response.user));
        router.push("/seller-dashboard");
        setIsOpen(false);
      })
      .catch((error) => {
        toast.error("Signup failed", error);

        setFieldError("error", "An error occurred. Please try again.");
      })
      .finally(() => {
        setSubmitting(false);
        console.log("response");
      });
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        cursor={"pointer"}
        display={{ base: "none", md: "inline-flex" }}
        fontSize={"sm"}
        fontWeight={"400"}
        color={"white"}
        bg={"transparent"}
        _hover={{
          bg: "transparent",
          color: "blue.500",
        }}
      >
        Login
      </Button>
      <AppModal title="Login" isOpen={isOpen} setIsOpen={setIsOpen}>
        <Formik
          initialValues={{ identifier: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({
            isSubmitting,
            values,
            handleChange,
            handleBlur,
            errors,
            touched,
          }) => (
            <Form>
              <Stack spacing={4} px={1}>
                <Input.Free
                  type="email"
                  name="identifier"
                  placeholder="Email"
                  label="Email"
                  value={values.identifier}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.identifier}
                  error={errors.identifier}
                  isRequired
                />

                <Input.Free
                  type="password"
                  name="password"
                  placeholder="Password"
                  label="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.password}
                  error={errors.password}
                  isRequired
                />

                <Button
                  bg="brand.primary"
                  fontWeight={400}
                  textColor={"white"}
                  type="submit"
                  mt={4}
                  isLoading={isSubmitting}
                  disabled={errors}
                >
                  Login
                </Button>
                <ErrorMessage name="error" component="div" />
              </Stack>
            </Form>
          )}
        </Formik>
      </AppModal>
    </>
  );
};

export default SigninModal;
