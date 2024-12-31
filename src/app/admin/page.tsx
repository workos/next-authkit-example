import { withAuth } from "@workos-inc/authkit-nextjs";
import { Text, Heading, Flex } from "@radix-ui/themes";
import '@radix-ui/themes/styles.css';
import { WorkOsWidgets, UsersManagement } from '@workos-inc/widgets';
import { getSession } from '@workos-inc/authkit-nextjs';

export default async function AdminPage() {
  const { user, role, permissions } = await withAuth({ ensureSignedIn: true });

  const session = await getSession();
  const authToken: string = session?.accessToken ? session.accessToken : "";

  function UsersTable(authToken: string) {
    return (
      <WorkOsWidgets
        theme={{
          appearance: 'light',
          accentColor: 'iris',
          radius: 'large',
          fontFamily: 'sans-serif',
        }}
      >
        <UsersManagement authToken={authToken} />
      </WorkOsWidgets>
    );
  }
  

  return (
    <>
      <Flex direction="column" gap="2" mb="7">
        <Heading size="8" align="center">
          Admin Team Management
        </Heading>
        <Text size="5" align="center" color="gray">
          Below are your team details
        </Text>
      </Flex>

      {UsersTable(authToken)}
    </>
  );
}
