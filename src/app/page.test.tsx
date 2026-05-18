import { describe, it, expect, jest } from "@jest/globals";
import HomePage from "./page";

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock @workos-inc/authkit-nextjs
jest.mock("@workos-inc/authkit-nextjs", () => ({
  withAuth: jest.fn(),
}));

// Mock @radix-ui/themes components
jest.mock("@radix-ui/themes", () => ({
  Button: ({ children, asChild, size, variant, onClick }: { children: React.ReactNode; asChild?: boolean; size?: string; variant?: string; onClick?: () => void }) => (
    <button data-size={size} data-variant={variant} onClick={onClick}>
      {children}
    </button>
  ),
  Flex: ({ children, direction, align, gap, mt }: { children: React.ReactNode; direction?: string; align?: string; gap?: string; mt?: string }) => (
    <div data-direction={direction} data-align={align} data-gap={gap} data-mt={mt}>
      {children}
    </div>
  ),
  Heading: ({ children, size }: { children: React.ReactNode; size?: string }) => (
    <h1 data-size={size}>{children}</h1>
  ),
  Text: ({ children, color, mb }: { children: React.ReactNode; color?: string; mb?: string }) => (
    <p data-color={color} data-mb={mb}>{children}</p>
  ),
}));

// Mock SignInButton component
jest.mock("./components/sign-in-button", () => ({
  SignInButton: ({ large }: { large?: boolean }) => (
    <span data-testid="sign-in-button" data-large={large}>Sign In</span>
  ),
}));

describe("HomePage", () => {
  const { withAuth } = require("@workos-inc/authkit-nextjs");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders welcome message with user firstName when user is authenticated", async () => {
    const mockUser = { firstName: "John", email: "john@example.com" };
    (withAuth as jest.Mock<any>).mockResolvedValue({ user: mockUser });

    const component = await HomePage();
    const rendered = JSON.stringify(component);

    expect(rendered).toContain("Welcome back");
    expect(rendered).toContain("John");
    expect(rendered).toContain("You are now authenticated into the application");
    expect(rendered).toContain("View account");
  });

  it("renders welcome message without firstName when user has no firstName", async () => {
    const mockUser = { email: "john@example.com" };
    (withAuth as jest.Mock<any>).mockResolvedValue({ user: mockUser });

    const component = await HomePage();
    const rendered = JSON.stringify(component);

    expect(rendered).toContain("Welcome back");
  });

  it("renders AuthKit authentication example when user is not authenticated", async () => {
    (withAuth as jest.Mock<any>).mockResolvedValue({ user: null });

    const component = await HomePage();
    const rendered = JSON.stringify(component);

    expect(rendered).toContain("AuthKit authentication example");
    expect(rendered).toContain("Sign in to view your account details");
  });

  it("renders SignInButton when user is not authenticated", async () => {
    (withAuth as jest.Mock<any>).mockResolvedValue({ user: null });

    const component = await HomePage();
    const rendered = JSON.stringify(component);

    // Check for the large prop which indicates SignInButton is rendered (SignInButton passes large={true})
    expect(rendered).toContain('"large":true');
  });

  it("renders SignInButton and View account button when user is authenticated", async () => {
    const mockUser = { firstName: "Jane", email: "jane@example.com" };
    (withAuth as jest.Mock<any>).mockResolvedValue({ user: mockUser });

    const component = await HomePage();
    const rendered = JSON.stringify(component);

    expect(rendered).toContain('"large":true');
    expect(rendered).toContain("View account");
  });
});
