import { authkitMiddleware } from "@workos-inc/nextjs";

export default authkitMiddleware();

// Match against the pages
export const config = { matcher: ["/", "/account/:path*"] };
