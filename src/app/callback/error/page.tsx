"use client";

import { Text, Heading, Flex, Box, Callout, Container } from "@radix-ui/themes";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function ErrorPage() {
  return (
    <>
      <Flex direction="column" gap="2" mb="7" align="center">
        <Box pl="9" pr="9">
          <Heading size="8" align="left">
            Error
          </Heading>
          <Container pt="4">
            <Callout.Root color="red" role="alert">
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>Something went wrong</Callout.Text>
            </Callout.Root>
          </Container>
          <Container pt="4">
            <Text size="3" align="center" color="gray">
              Couldn’t sign in. If you are not sure what happened, please
              contact your organization admin.
            </Text>
          </Container>
        </Box>
      </Flex>
    </>
  );
}
