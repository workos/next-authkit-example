import {
  getSignInUrl,
  getSignUpUrl,
  getUser,
  signOut,
} from "@workos-inc/authkit-nextjs";

import { Button, Flex } from "@radix-ui/themes";

export async function SignInButton({ large }: { large?: boolean }) {
  const { user } = await getUser();

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

  const signInUrl = await getSignInUrl();
  const signUpUrl = await getSignUpUrl();

  return (
    <Flex gap="3">
      <Button asChild size={large ? "3" : "2"}>
        <a href={signInUrl}>Sign In {large && "with AuthKit"}</a>
      </Button>
      <Button asChild size={large ? "3" : "2"}>
        <a href={signUpUrl}>Sign Up {large && "with AuthKit"}</a>
      </Button>
    </Flex>
  );
}
