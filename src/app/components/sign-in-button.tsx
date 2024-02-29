import { getAuthorizationUrl, getUser, signOut } from "../../auth";
import { Button, Flex } from "@radix-ui/themes";

export async function SignInButton({ large }: { large?: boolean }) {
  const { user } = await getUser();
  const authorizationUrl = await getAuthorizationUrl();

  if (user) {
    return (
      <Flex gap="3">
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button type="submit" size={large ? "3" : "2"}>
            Sign Out
          </Button>
        </form>
      </Flex>
    );
  }

  return (
    <Button asChild size={large ? "3" : "2"}>
      <a href={authorizationUrl}>Sign In {large && "with AuthKit"}</a>
    </Button>
  );
}
