import { Card, Grid, Heading, Text } from "@radix-ui/themes";

export async function Footer() {
  return (
    <Grid columns={{ initial: "1", sm: "3" }} gap="5">
      <Card size="4" asChild variant="classic">
        <a href="https://workos.com/docs">
          <Heading size="4" mb="1">
            Documentation
          </Heading>
          <Text color="gray">
            View integration guides and SDK documentation.
          </Text>
        </a>
      </Card>
      <Card size="4" asChild variant="classic">
        <a href="https://workos.com/docs/reference">
          <Heading size="4" mb="1">
            API Reference
          </Heading>
          <Text color="gray">
            Every WorkOS API method and endpoint documented.
          </Text>
        </a>
      </Card>
      <Card size="4" asChild variant="classic">
        <a href="https://workos.com">
          <Heading size="4" mb="1">
            WorkOS
          </Heading>
          <Text color="gray">Learn more about other WorkOS products.</Text>
        </a>
      </Card>
    </Grid>
  );
}
