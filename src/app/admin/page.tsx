import { withAuth } from "@workos-inc/authkit-nextjs";
import { Text, Heading, Flex, Card, Grid } from "@radix-ui/themes";
import '@radix-ui/themes/styles.css';
import { WorkOsWidgets, UsersManagement } from '@workos-inc/widgets';
import { getSession } from '@workos-inc/authkit-nextjs';
import PortalButton from '../components/PortalButton';

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
      {session?.role === "admin" ? (
        <>
          <Flex direction="column" gap="2" mb="4">
            <Heading size="8" align="center">
              Admin Settings
            </Heading>
            <Text size="5" align="left" color="gray">
              Team Management
            </Text>
          </Flex>

          {UsersTable(authToken)}
          
          {session?.organizationId && (
            <Flex direction="column" gap="2" mb="7" pt="6">
              <Text size="5" align="left" color="gray" mb="4">
                Enterprise Connections
              </Text>
              <Grid columns={{ initial: "1", sm: "3" }} gap={{ initial: "3", sm: "5" }}>
                <PortalButton organizationId={session.organizationId} intent="sso" />
                <PortalButton organizationId={session.organizationId} intent="dsync" />
              </Grid>
            </Flex>
          )}
        </>
      ) : (
        <Flex direction="column" gap="2" mb="4">
          <Heading size="8" align="center">
            Admin Settings
          </Heading>
          <Text size="5" align="left" color="gray">
            Only Admin users can access this page.
          </Text>
        </Flex>
      )}
    </>
  );
}
