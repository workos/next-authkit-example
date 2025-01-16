"use server";

import { getSignInUrl } from "@workos-inc/authkit-nextjs";

export const getSignInUrlAction = async () => {
  return await getSignInUrl();
};
