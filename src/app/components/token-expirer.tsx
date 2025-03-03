"use client";

import { Button, Card, Flex, Text } from "@radix-ui/themes";
import { useState } from "react";
import { expireAccessTokenAction } from "../actions/expire-access-token";
import { expireTokenAction } from "../actions/expire-token";

export function TokenExpirer() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const expireAccessToken = async () => {
    try {
      setLoading(true);
      setStatus("Expiring access token while preserving refresh token...");
      const result = await expireAccessTokenAction();
      setStatus(result.message);
    } catch (error) {
      setStatus(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const clearSession = async () => {
    try {
      setLoading(true);
      setStatus("Completely removing session...");
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
          These tools help reproduce the refresh token race condition.
        </Text>

        <Flex gap="2">
          <Button
            color="yellow"
            onClick={expireAccessToken}
            size="2"
            disabled={loading}
          >
            {loading ? "Working..." : "Expire Access Token Only"}
          </Button>

          <Button
            color="red"
            onClick={clearSession}
            size="2"
            disabled={loading}
          >
            {loading ? "Working..." : "Clear Session"}
          </Button>
        </Flex>

        <Text size="2" color="blue">
          Use &quot;Expire Access Token Only&quot; to simulate token expiration
          while keeping refresh token valid.
        </Text>

        {status && (
          <Text size="2" color="orange">
            {status}
          </Text>
        )}
      </Flex>
    </Card>
  );
}
