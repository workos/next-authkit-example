import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware({
  debug: true,
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ["/auth/callback"],
  },
});

// Match against the pages
// export const config = { matcher: ["/", "/account/:path*"] };
