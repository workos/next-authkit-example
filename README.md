# Next.js integration example using AuthKit

An example application demonstrating how to authenticate users with AuthKit and the WorkOS Node SDK.

> Refer to the [User Management](https://workos.com/docs/user-management) documentation for reference.

## Project setup

To get started, clone the repo:

```bash

git clone git@github.com:workos/next-authkit-example.git
```

Navigate to the cloned repo and install the dependencies:

```bash
cd next-authkit-example && npm install
```

### Create a redirect URI in WorkOS

Sign up for a [WorkOS account](https://dashboard.workos.com/signup) or [sign in](https://dashboard.workos.com/signin?redirect=/get-started) if you already have an account. In the [WorkOS dashboard](https://dashboard.workos.com), head to the Redirects tab and create a [sign-in callback redirect](https://workos.com/docs/user-management/1-configure-your-project/configure-a-redirect-uri) for `http://localhost:3000/callback`.

### Set up environment variables

After creating the redirect URI, navigate to the API keys tab and copy the _Client ID_ and the _Secret Key_. Rename the `.env.local.example` file to `.env.local` and supply your Client ID and API key as environment variables.

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

### Run the development environment

Finally, start the development environment and navigate to http://localhost:3000.

```bash
npm run dev
```
