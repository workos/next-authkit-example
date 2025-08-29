import { test as base, expect, type BrowserContext } from "@playwright/test";
import { WorkOS } from "@workos-inc/node";

// User configuration map - now keyed by email-password
interface TestUser {
  email: string;
  password: string;
  cookies?: any[]; // Cached cookies
}

// Cache for authenticated users keyed by "email-password"
const userCache: Record<string, TestUser> = {};

// Extended test interface
interface TestFixtures {
  email?: string; // Email to authenticate as
  password?: string; // Password to authenticate with
}

interface WorkerFixtures {
  // Worker-scoped fixtures could go here if needed
}

async function authenticateUser(
  email: string,
  password: string,
  request: any,
  context: BrowserContext
): Promise<void> {
  if (!email || !password) {
    throw new Error("Both email and password are required");
  }

  // Create cache key from email and password
  const cacheKey = `${email}-${password}`;
  let user = userCache[cacheKey];

  // Initialize user in cache if not exists
  if (!user) {
    user = userCache[cacheKey] = {
      email,
      password,
    };
  }

  // Check if we have valid cached cookies
  if (user.cookies) {
    console.log(`Using cached cookies for user: ${email}`);
    await context.addCookies(user.cookies);
    return;
  }

  console.log(`Authenticating user: ${email}`);

  const workosApiKey = process.env.WORKOS_API_KEY;
  const workosClientId = process.env.WORKOS_CLIENT_ID;

  if (!workosApiKey || !workosClientId) {
    throw new Error(
      "Missing WORKOS_API_KEY or WORKOS_CLIENT_ID environment variables"
    );
  }

  const workos = new WorkOS(workosApiKey, {
    apiHostname: process.env.WORKOS_API_HOSTNAME,
  });

  try {
    // Step 1: Get tokens from WorkOS API
    const authResponse = await workos.userManagement.authenticateWithPassword({
      clientId: workosClientId,
      email,
      password,
    });

    // Step 2: Save session via our test endpoint
    const baseURL = process.env.TEST_BASE_URL;
    const sessionResponse = await request.post(
      `${baseURL}/api/test/set-session`,
      {
        data: {
          user: authResponse.user,
          accessToken: authResponse.accessToken,
          refreshToken: authResponse.refreshToken,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!sessionResponse.ok()) {
      const errorText = await sessionResponse.text();
      throw new Error(
        `Authentication failed: ${sessionResponse.status()} - ${errorText}`
      );
    }

    // Step 3: Extract and cache cookies
    const responseCookies = sessionResponse.headers()["set-cookie"];
    if (responseCookies) {
      const cookies = [];
      const cookieStrings = Array.isArray(responseCookies)
        ? responseCookies
        : [responseCookies];

      for (const cookieString of cookieStrings) {
        if (cookieString && cookieString.includes("wos-session")) {
          const [nameValue, ...attributes] = cookieString.split(";");
          const [name, value] = nameValue.split("=");

          const cookie = {
            name: name.trim(),
            value: value.trim(),
            domain: "localhost",
            path: "/",
            httpOnly: true,
            secure: false,
            sameSite: "Lax" as const,
          };

          cookies.push(cookie);
        }
      }

      if (cookies.length > 0) {
        // Cache cookies for user
        user.cookies = cookies;

        // Add cookies to current context
        await context.addCookies(cookies);
        console.log(`Authenticated and cached user: ${email}`);
      } else {
        throw new Error("No wos-session cookie found in response");
      }
    } else {
      throw new Error("No Set-Cookie header found in response");
    }
  } catch (error) {
    console.error(`Authentication failed for user ${email}:`, error);
    throw error;
  }
}

// Create extended test with email/password fixtures
export const test = base.extend<TestFixtures, WorkerFixtures>({
  email: [undefined, { option: true }], // Email for authentication (optional)
  password: [undefined, { option: true }], // Password for authentication (optional)

  // Override the default page fixture to handle authentication
  page: async ({ page, email, password, request, context }, use) => {
    if (email && password) {
      // Authenticate the user with email/password before providing the page
      await authenticateUser(email, password, request, context);
    }
    // If email/password not provided, page remains unauthenticated
    await use(page);
  },
});

export { expect };
