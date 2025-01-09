import type { NextApiRequest, NextApiResponse } from "next";
import { SignatureVerificationException, WorkOS } from "@workos-inc/node";

const workos = new WorkOS(process.env.WORKOS_API_KEY);

export async function POST(req: Request) {
  const payload = await req.json();
  const sigHeader = req.headers.get("workos-signature");

  let action;

  try {
    action = await workos.actions.constructAction({
      payload: payload,
      sigHeader: sigHeader as string,
      secret: process.env.ACTIONS_SECRET as string,
    });
  } catch (err) {
    if (err instanceof SignatureVerificationException) {
      console.error(err.message);
    }
  }

  type Verdict = "Allow" | "Deny";

  type AuthResponse = {
    type: "authentication";
    verdict: Verdict;
    errorMessage?: string;
  };

  let responsePayload: AuthResponse = {
    type: "authentication",
    verdict: "Allow",
  };

  // Determine whether to allow or deny the action
  if (action?.object === "authentication_action_context") {
    // Check IP location first
    if (action.ipAddress) {
      try {
        const geoResponse = await fetch(
          `https://ipapi.co/${action.ipAddress}/json/`
        );
        const geoData = await geoResponse.json();

        if (geoData.country !== "US") {
          responsePayload = {
            type: "authentication" as const,
            verdict: "Allow" as const,
            errorMessage: "Access restricted to United States only",
          };

          if (!process.env.ACTIONS_SECRET) {
            throw new Error("ACTIONS_SECRET is required");
          }
          return Response.json(
            await workos.actions.signResponse(
              responsePayload,
              process.env.ACTIONS_SECRET
            )
          );
        }
      } catch (error) {
        console.error("IP Geolocation error:", error);
      }
    }

    // Check if the user's email is a gmail address
    if (action.user?.email.split("@")[1] === "gmail.com") {
      responsePayload = {
        type: "authentication" as const,
        verdict: "Allow" as const,
        errorMessage: "Please use a work email address",
      };
    } else {
      responsePayload = {
        type: "authentication" as const,
        verdict: "Allow" as const,
      };
    }
  }

  if (!process.env.ACTIONS_SECRET) {
    throw new Error("ACTIONS_SECRET is required");
  }
  const response = await workos.actions.signResponse(
    responsePayload,
    process.env.ACTIONS_SECRET
  );

  return Response.json(response);
}
