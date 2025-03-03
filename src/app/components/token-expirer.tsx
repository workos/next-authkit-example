"use client";

import { useState } from "react";
import { Button, Text, Flex, Box, Card } from "@radix-ui/themes";

export function TokenExpirer() {
  const [status, setStatus] = useState<string | null>(null);

  const expireToken = () => {
    try {
      // Get the WorkOS cookie
      const cookies = document.cookie.split(";");
      const workosCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("wos-session="),
      );

      console.log("WorkOS Cookie:", workosCookie);

      if (!workosCookie) {
        setStatus("No WorkOS session cookie found. Please sign in first.");
        return;
      }

      // Create an expired version by setting its expiry to the past
      document.cookie = `${workosCookie.trim()}; max-age=0; path=/`;
      setStatus(
        "Session cookie has been expired. Try the concurrent requests now.",
      );
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <Card
      size="2"
      style={{ marginTop: "20px", width: "100%", maxWidth: "500px" }}
    >
      <Flex direction="column" gap="2">
        <Text weight="bold">Token Testing Tools</Text>
        <Text size="2" color="gray">
          This will force your token to be expired, which helps reproduce the
          refresh token race condition.
        </Text>

        <Box>
          <Button color="red" onClick={expireToken} size="2">
            Expire Auth Token
          </Button>
        </Box>

        {status && (
          <Text size="2" color="orange">
            {status}
          </Text>
        )}
      </Flex>
    </Card>
  );
}
