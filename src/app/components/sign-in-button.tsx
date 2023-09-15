import { Avatar, Button, Flex } from "@radix-ui/themes";
import { getAuthorizationUrl, getUser, logOut } from "../actions";

export async function SignInButton() {
  const { isAuthenticated, user } = await getUser();
  const authorizationUrl = await getAuthorizationUrl();

  if (isAuthenticated && user) {
    const { firstName, lastName, email } = user;

    const avatarText =
      firstName && lastName ? `${firstName[0]}${lastName[0]}` : email[0];

    return (
      <Flex gap="3">
        <form action={logOut}>
          <Button type="submit">Sign Out</Button>
        </form>
        <Avatar fallback={avatarText} size="2" />
      </Flex>
    );
  }

  return (
    <Button asChild>
      <a href={authorizationUrl}>Sign In</a>
    </Button>
  );
}
