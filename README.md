# Next.js integration example using AuthKit

An example application demonstrating how to authenticate users with AuthKit and the WorkOS Node SDK.

## Project setup

To get started, clone the repo:

```bash
git clone https://github.com/workos/next-authkit-example.git
```

Navigate to the cloned repo and install the dependencies:

```bash
npm install
```

## Getting started with WorkOS

Sign up for a [WorkOS account](https://dashboard.workos.com/signup), log in.

### Create a redirect URI

In the WorkOS dashboard, head to the Redirects tab and create a [Sign-in callback redirect](https://workos.com/docs/user-management/1-configure-your-project/configure-a-redirect-uri) for `http://localhost:3000/callback`.

### Set up environment variables

After creating the redirect URI, navigate to the API keys tab and copy the _Client ID_ and the _Secret Key_. Rename the `.env.local.example` file to `.env.local` and supply your Client ID and API key as environment variables.

Additionally, [create a signing secret](https://workos.com/docs/user-management/3-handle-the-user-session/create-a-signing-secret) by running this command.

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'));"
```

Copy the output of that command into the environment variable `JWT_SECRET_KEY`.

```
WORKOS_CLIENT_ID=<YOUR_CLIENT_ID>
WORKOS_API_KEY=<YOUR_API_SECRET_KEY>
WORKOS_REDIRECT_URI=http://localhost:3000/callback
JWT_SECRET_KEY=<YOUR_JWT_SECRET_KEY>
```

### Start the development environment

Finally, start the development environment and navigate to http://localhost:3000.

```bash
npm run dev
```
