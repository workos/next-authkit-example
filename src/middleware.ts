import { authkitMiddleware } from "./temp_node_modules/@workos-inc/nextjs";

export default authkitMiddleware();

// Match against the pages
export const config = { matcher: ["/", "/account/:path*"] };
