# Next.js integration example using AuthKit

An example application demonstrating how to authenticate users with AuthKit and the WorkOS Node SDK.

> Refer to the [User Management](https://workos.com/docs/user-management) documentation for reference.

## Prerequisites

You will need a [WorkOS account](https://dashboard.workos.com/signup).

## Running the example

1.  Create a redirect URI in WorkOS

    In the [WorkOS dashboard](https://dashboard.workos.com), head to the Redirects tab and create a [sign-in callback redirect](https://workos.com/docs/user-management/1-configure-your-project/configure-a-redirect-uri) for `http://localhost:3000/callback`.

2.  Set up environment variables

    After creating the redirect URI, navigate to the API keys tab and copy the _Client ID_ and the _Secret Key_. Rename the `.env.local.example` file to `.env.local` and supply your Client ID and API key as environment variables.

3.  Create a signing secret

    Additionally, [create a signing secret](https://workos.com/docs/user-management/3-handle-the-user-session/create-a-signing-secret) by running the below command. Copy the output into the environment variable `JWT_SECRET_KEY`.

    ```bash
    node -e "console.log(require('crypto').randomBytes(64).toString('base64'));"
    ```

    Your `.env.local` file should have the following variables filled.

    ```bash
    WORKOS_CLIENT_ID=<YOUR_CLIENT_ID>
    WORKOS_API_KEY=<YOUR_API_SECRET_KEY>
    WORKOS_REDIRECT_URI=http://localhost:3000/callback
    JWT_SECRET_KEY=<YOUR_JWT_SECRET_KEY>
    ```

4.  Start the development environment

    Run the following command and navigate to [http://localhost:3000](http://localhost:3000).

    ```bash
    npm run dev
    ```
