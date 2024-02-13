import {
  Text,
  Heading,
  Flex,
  CalloutRoot,
  CalloutIcon,
  CalloutText,
  Container,
} from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export default function ErrorPage() {
  return (
    <Flex gap="4" direction="column" style={{ maxWidth: "430px" }}>
      <Heading size="8">Error</Heading>
      <Container>
        <CalloutRoot color="red" role="alert">
          <CalloutIcon>
            <ExclamationTriangleIcon />
          </CalloutIcon>
          <CalloutText>Something went wrong</CalloutText>
        </CalloutRoot>
      </Container>
      <Container>
        <Text size="3" align="center" color="gray">
          Couldn’t sign in. If you are not sure what happened, please contact
          your organization admin.
        </Text>
      </Container>
    </Flex>
  );
}
