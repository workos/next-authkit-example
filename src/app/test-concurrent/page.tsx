"use client";

import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { useState } from "react";
import { TokenExpirer } from "../components/token-expirer";

export default function TestConcurrentPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<
    { success: boolean; message: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const makeApiRequests = async () => {
    setLoading(true);
    setResults([]);

    console.log("Starting multiple concurrent requests...");

    // Make 10 concurrent requests to increase the chance of race conditions
    const promises = Array(10)
      .fill(0)
      .map((_, i) =>
        fetch(`/api/protected-endpoint?id=${i}`)
          .then(async (res) => {
            const data = await res.json();
            console.log(`Request ${i} completed with status: ${res.status}`);
            return {
              success: res.ok,
              message: res.ok
                ? `Request ${i + 1} succeeded`
                : `Request ${i + 1} failed: ${data.error || "Unknown error"}`,
            };
          })
          .catch((error) => {
            console.error(`Request ${i} error:`, error);
            return {
              success: false,
              message: `Request ${i + 1} error: ${error.message}`,
            };
          }),
      );

    const results = await Promise.all(promises);
    setResults(results);
    setLoading(false);
  };

  return (
    <Flex direction="column" align="center" gap="4" width="100%">
      <Heading size="7">Test Concurrent Requests</Heading>

      <Text size="4" color="gray">
        This page will trigger multiple concurrent API requests to test token
        refresh behavior.
      </Text>

      {user ? (
        <>
          <TokenExpirer />

          <Text size="3" color="blue" mt="4">
            1. Use the &quot;Expire Auth Token&quot; button above
            <br />
            2. Then click the button below to start concurrent requests
          </Text>

          <Button onClick={makeApiRequests} disabled={loading} size="3">
            {loading ? "Making requests..." : "Start Concurrent Requests Test"}
          </Button>

          {results.length > 0 && (
            <Box width="100%" style={{ maxWidth: "500px" }}>
              <Heading size="4" mb="2">
                Results:
              </Heading>
              {results.map((result, index) => (
                <Text
                  key={index}
                  as="div"
                  mb="2"
                  color={result.success ? "green" : "red"}
                >
                  {result.message}
                </Text>
              ))}
            </Box>
          )}
        </>
      ) : (
        <Text size="4" color="orange">
          Please sign in first to run this test.
        </Text>
      )}
    </Flex>
  );
}
