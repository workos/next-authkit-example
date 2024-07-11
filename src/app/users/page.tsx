import { Button, Flex, Heading, Table, Text } from "@radix-ui/themes";
import { getUser } from "@workos-inc/authkit-nextjs";
import workos from "../workos";
import { TrashIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const { organizationId, hasPermission } = await getUser({
    ensureSignedIn: true,
  });

  if (!hasPermission("users:view")) {
    redirect("/");
    return;
  }

  const userManager = hasPermission("users:manage");

  const { data: users } = await workos.userManagement.listUsers({
    organizationId,
  });

  if (!users?.length) {
    return <Text>No users found.</Text>;
  }

  return (
    <>
      <Flex direction="column" gap="2" mb="7">
        <Heading size="8" align="center">
          Users
        </Heading>
        <Text size="5" align="center" color="gray">
          Below are a list of users from your organization.
        </Text>
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            {userManager && (
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            )}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users.map(({ firstName, lastName, email }) => (
            <Table.Row key={email}>
              <Table.RowHeaderCell>
                {firstName} {lastName}
              </Table.RowHeaderCell>
              <Table.Cell>{email}</Table.Cell>
              {userManager && (
                <Table.Cell>
                  <Button
                    style={{ cursor: "pointer" }}
                    size="1"
                    color="red"
                    onClick={async () => {
                      "use server";
                    }}
                  >
                    <TrashIcon /> Delete user
                  </Button>
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
}
