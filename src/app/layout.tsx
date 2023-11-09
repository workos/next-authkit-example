// Import the base CSS styles for the radix-ui components.
import "@radix-ui/themes/styles.css";

import type { Metadata } from "next";
import { Theme, Card, Container, Flex, Button } from "@radix-ui/themes";
import NextLink from "next/link";
import { Footer } from "./components/footer";
import { SignInButton } from "./components/sign-in-button";

export const metadata: Metadata = {
  title: "Example AuthKit Authenticated App",
  description: "Example Next.js application demonstrating how to use AuthKit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ padding: 0, margin: 0 }}>
        <Theme accentColor="iris" style={{ backgroundColor: "var(--gray-1)" }}>
          <Container px="5">
            <Flex align="center" style={{ height: "100vh" }} py="9">
              <Flex
                direction="column"
                style={{
                  height: "100%",
                  maxHeight: 850,
                  minHeight: 500,
                  width: "100%",
                }}
                gap="5"
              >
                <Flex grow="1">
                  <Card size="4" style={{ width: "100%" }}>
                    <Flex direction="column" height="100%">
                      <Flex asChild justify="between">
                        <header>
                          <Flex gap="4">
                            <Button asChild variant="soft">
                              <NextLink href="/">Home</NextLink>
                            </Button>

                            <Button asChild variant="soft">
                              <NextLink href="/account">Account</NextLink>
                            </Button>
                          </Flex>

                          <SignInButton />
                        </header>
                      </Flex>

                      <Flex grow="1" align="center" justify="center">
                        <main>{children}</main>
                      </Flex>
                    </Flex>
                  </Card>
                </Flex>
                <Footer />
              </Flex>
            </Flex>
          </Container>
        </Theme>
      </body>
    </html>
  );
}
