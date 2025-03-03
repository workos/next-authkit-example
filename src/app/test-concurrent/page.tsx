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

    // Use more requests to increase the chance of seeing the race condition
    const concurrentRequests = 10;

    // Make concurrent requests to increase the chance of race conditions
    const promises = Array(concurrentRequests)
      .fill(0)
      .map((_, i) =>
        fetch(`/api/protected-endpoint?id=${i}`)
          .then(async (res) => {
            try {
              const data = await res.json();
              console.log(
                `Request ${i} completed with status: ${res.status}`,
                data,
              );

              // Check for refresh token error in the response data
              const errorMessage = data.error || "";
              const isRefreshTokenError = errorMessage.includes(
                "Refresh token already exchanged",
              );

              if (isRefreshTokenError) {
                return {
                  success: false,
                  message: `Request ${i + 1} hit the refresh token race condition! 🎯`,
                  isRefreshTokenError: true,
                };
              }

              return {
                success: res.ok,
                message: res.ok
                  ? `Request ${i + 1} succeeded`
                  : `Request ${i + 1} failed: ${errorMessage || "Unknown error"}`,
              };
            } catch (error) {
              console.error(`Request ${i} error parsing response:`, error);
              return {
                success: false,
                message: `Request ${i + 1} error: Failed to parse response`,
              };
            }
          })
          .catch((error) => {
            console.error(`Request ${i} network error:`, error);
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
            1. Use the &quot;Expire Access Token Only&quot; button above
            <br />
            2. Then click the button below to start concurrent requests
            <br />
            3. Watch the browser console for &quot;Refresh token already
            exchanged&quot; errors
          </Text>

          <Button onClick={makeApiRequests} disabled={loading} size="3">
            {loading ? "Making requests..." : "Start Concurrent Requests Test"}
          </Button>

          {results.length > 0 && (
            <Box width="100%" style={{ maxWidth: "500px" }}>
              <Heading size="4" mb="2">
                Results:
              </Heading>

              {/* Summary of results */}
              <Box mb="4">
                <Text as="div" mb="1" size="2" weight="bold">
                  Summary:
                </Text>
                <Text as="div" mb="1" size="2">
                  • Success: {results.filter((r) => r.success).length} requests
                </Text>
                <Text as="div" mb="1" size="2">
                  • Failed: {results.filter((r) => !r.success).length} requests
                </Text>
                {results.some((r) => (r as any).isRefreshTokenError) && (
                  <Text as="div" mb="1" size="2" color="orange" weight="bold">
                    💥 Refresh token race condition detected!
                  </Text>
                )}
              </Box>

              {/* Detailed results */}
              {results.map((result, index) => (
                <Text
                  key={index}
                  as="div"
                  mb="2"
                  color={
                    (result as any).isRefreshTokenError
                      ? "orange"
                      : result.success
                        ? "green"
                        : "red"
                  }
                  weight={
                    (result as any).isRefreshTokenError ? "bold" : "regular"
                  }
                >
                  {result.message}
                </Text>
              ))}

              <Text as="div" mt="4" size="2" style={{ opacity: 0.7 }}>
                Note: If you don&apos;t see the race condition error, try again.
                It depends on timing.
              </Text>
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
