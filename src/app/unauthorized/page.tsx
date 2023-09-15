import { Heading, Text, Flex, Button } from "@radix-ui/themes";
import { getAuthorizationUrl } from "../actions";

export default async function ProtectedPage() {
  const authorizationUrl = await getAuthorizationUrl();

  return (
    <Flex direction="column" gap="2" align="center">
      <Heading size="8" align="center">
        Not authorized to view this page
      </Heading>
      <Text size="5" color="gray" align="center">
        Sign in to view your account details
      </Text>
      <Button asChild size="3" mt="4">
        <a href={authorizationUrl}>Sign In with AuthKit</a>
      </Button>
    </Flex>
  );
}
