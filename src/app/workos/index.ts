import { WorkOS } from "@workos-inc/node";

// Initialize the WorkOS client
const workos = new WorkOS(process.env.WORKOS_API_KEY);

export default workos;
