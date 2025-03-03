import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware({
  debug: true, // Enable debug logging
});

// Match against the pages
export const config = {
  matcher: ["/", "/account/:path*", "/api/:path*", "/test-concurrent"],
};
