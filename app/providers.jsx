// app/providers.tsx
"use client";
import '../assets/style.css'
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { defineStyleConfig } from "@chakra-ui/react";

const colors = {
  brand: {
    border: "#e2e2e2",
    primary: "#04b70a",
    secondary: "#a5a5ad",
    link: "#177de5",
  },
};

const Text = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    fontSize: "sm",
    color: "#000",
  },
  // defaultProps: {
  //   // color: "#f5f",
  // },
});
const Button = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    // bg: "#04b70a",
    // color: "#fff",
    fontWeight: 'medium'
  },
});

export const theme = extendTheme({
  colors,
  borders: {
    "1px": `1px solid ${colors.brand.border}`,
  },
  components: {
    Text,
    Button,
  },
});

export function Providers({ children }) {
  return (
    <CacheProvider>
      <ChakraProvider
        theme={theme}
        toastOptions={{ defaultOptions: { position: "top" } }}
      >
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
