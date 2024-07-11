import { getUser } from "@workos-inc/authkit-nextjs";

export async function ProtectedComponent({
  permission,
  children,
}: {
  permission: string;
  children: React.JSX.Element;
}) {
  const { hasPermission } = await getUser({
    ensureSignedIn: true,
  });

  if (!hasPermission(permission)) {
    return null;
  }

  return <>{children}</>;
}
