"use client";

import { useState } from "react";
import { Button, Text, Flex, Box, Card } from "@radix-ui/themes";
import { expireTokenAction } from "../actions/expire-token";

export function TokenExpirer() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const expireToken = async () => {
    try {
      setLoading(true);
      const result = await expireTokenAction();
      setStatus(result.message);
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
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
          <Button color="red" onClick={expireToken} size="2" disabled={loading}>
            {loading ? "Expiring..." : "Expire Auth Token"}
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
