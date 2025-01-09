'use client';

import { Card, Heading, Text } from "@radix-ui/themes";

// Option 2: Using union type (recommended)
type PortalIntent = "sso" | "dsync" | "audit_logs";

interface PortalButtonProps {
  organizationId: string;
  intent: PortalIntent;
}

export default function PortalButton({ organizationId, intent }: PortalButtonProps) {
  const handlePortalClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organization: organizationId,
          intent
        }),
      });
      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error generating portal link:', error);
    }
  };

  // Dynamically set the heading and text based on intent
  const getContent = () => {
    switch (intent) {
      case "sso":
        return {
          heading: "Configure SSO",
          text: "Set or manage your SSO configuration"
        };
      case "dsync":
        return {
          heading: "Configure SCIM",
          text: "Set up or manage your SCIM configuration"
        };
      case "audit_logs":
        return {
          heading: "View Audit Logs",
          text: "Manage your Audit Logs configuration"
        };
    }
  };

  const content = getContent();

  return (
    <Card size="4" asChild variant="classic">
      <a 
        onClick={handlePortalClick}
        style={{ cursor: 'pointer' }}
        role="button"
      >
        <Heading size="4" mb="1">
          {content.heading}
        </Heading>
        <Text color="gray">
          {content.text}
        </Text>
      </a>
    </Card>
  );
} 