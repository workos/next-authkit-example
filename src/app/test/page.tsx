"use client";
import { useEffect } from "react";
import { getUser } from "@workos-inc/authkit-nextjs";
import { Text, Heading, TextField, Flex, Box } from "@radix-ui/themes";

import { serverFunction } from "../../server-function";

export default function TestPage() {
  return (
    <>
      <p>This is just a test page</p>

      <button type="button" onClick={() => serverFunction()}>
        Trigger server function
      </button>
    </>
  );
}
