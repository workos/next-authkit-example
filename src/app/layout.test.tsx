import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the CSS import before importing the layout
jest.mock("@radix-ui/themes/styles.css", () => ({}));

import RootLayout from "./layout";

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock @workos-inc/authkit-nextjs/components
jest.mock("@workos-inc/authkit-nextjs/components", () => ({
  AuthKitProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="authkit-provider">{children}</div>
  ),
  Impersonation: () => <div data-testid="impersonation" />,
}));

// Mock @radix-ui/themes components
jest.mock("@radix-ui/themes", () => ({
  Theme: ({ children, accentColor, panelBackground, style }: { children: React.ReactNode; accentColor?: string; panelBackground?: string; style?: React.CSSProperties }) => (
    <div data-accent-color={accentColor} data-panel-background={panelBackground} style={style}>
      {children}
    </div>
  ),
  Container: ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div data-testid="container" style={style}>
      {children}
    </div>
  ),
  Flex: ({ children, direction, gap, p, height, justify, align, asChild, flexGrow }: { children: React.ReactNode; direction?: string; gap?: string; p?: string; height?: string; justify?: string; align?: string; asChild?: boolean; flexGrow?: string }) => (
    <div data-direction={direction} data-gap={gap} data-p={p} data-height={height} data-justify={justify} data-align={align} data-flex-grow={flexGrow} data-as-child={asChild}>
      {children}
    </div>
  ),
  Button: ({ children, asChild, variant, size }: { children: React.ReactNode; asChild?: boolean; variant?: string; size?: string }) => (
    <button data-as-child={asChild} data-variant={variant} data-size={size}>
      {children}
    </button>
  ),
  Card: ({ children, size }: { children: React.ReactNode; size?: string }) => (
    <div data-testid="card" data-size={size}>
      {children}
    </div>
  ),
  Box: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => (
    <div data-testid="box" data-as-child={asChild}>
      {children}
    </div>
  ),
}));

// Mock Footer component
jest.mock("./components/footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

// Mock SignInButton component
jest.mock("./components/sign-in-button", () => ({
  SignInButton: () => <span data-testid="sign-in-button">Sign In</span>,
}));

describe("RootLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the layout with all required components", () => {
    render(<RootLayout children={<div>Test Content</div>} />);

    expect(document.querySelector("[data-testid='authkit-provider']")).toBeInTheDocument();
    expect(document.querySelector("[data-testid='impersonation']")).toBeInTheDocument();
    expect(document.querySelector("[data-testid='container']")).toBeInTheDocument();
    expect(document.querySelector("[data-testid='card']")).toBeInTheDocument();
    expect(document.querySelector("[data-testid='footer']")).toBeInTheDocument();
    expect(document.querySelector("[data-testid='sign-in-button']")).toBeInTheDocument();
  });

  it("renders Theme with correct accentColor and panelBackground", () => {
    render(<RootLayout children={<div>Test Content</div>} />);

    const themeElement = document.querySelector("[data-accent-color='iris']");
    expect(themeElement).toBeInTheDocument();

    const themeWithPanelBackground = document.querySelector("[data-panel-background='solid']");
    expect(themeWithPanelBackground).toBeInTheDocument();
  });

  it("renders navigation links to Home and Account", () => {
    render(<RootLayout children={<div>Test Content</div>} />);

    const links = document.querySelectorAll("a");
    const homeLink = Array.from(links).find((link) => link.getAttribute("href") === "/");
    const accountLink = Array.from(links).find((link) => link.getAttribute("href") === "/account");

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveTextContent("Home");
    expect(accountLink).toBeInTheDocument();
    expect(accountLink).toHaveTextContent("Account");
  });

  it("renders children in the main element", () => {
    render(
      <RootLayout children={<div data-testid="child-content">Child Content</div>} />
    );

    const mainElement = document.querySelector("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveTextContent("Child Content");
  });

  it("renders header with navigation and sign in button", () => {
    render(<RootLayout children={<div>Test Content</div>} />);

    const header = document.querySelector("header");
    expect(header).toBeInTheDocument();

    const signInButton = document.querySelector("[data-testid='sign-in-button']");
    expect(signInButton).toBeInTheDocument();
  });

  it("renders Flex components with correct direction and gap", () => {
    render(<RootLayout children={<div>Test Content</div>} />);

    const columnFlex = document.querySelector("[data-direction='column']");
    expect(columnFlex).toBeInTheDocument();

    const flexWithGap = document.querySelector("[data-gap='5']");
    expect(flexWithGap).toBeInTheDocument();
  });

  it("renders Card with size 4", () => {
    render(<RootLayout children={<div>Test Content</div>} />);

    const card = document.querySelector("[data-testid='card'][data-size='4']");
    expect(card).toBeInTheDocument();
  });

  it("renders Buttons with variant soft for navigation", () => {
    render(<RootLayout children={<div>Test Content</div>} />);

    const softButtons = document.querySelectorAll("[data-variant='soft']");
    expect(softButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("renders Box with asChild prop", () => {
    render(<RootLayout children={<div>Test Content</div>} />);

    const boxWithAsChild = document.querySelector("[data-testid='box'][data-as-child='true']");
    expect(boxWithAsChild).toBeInTheDocument();
  });

  it("renders Flex with asChild prop for header", () => {
    render(<RootLayout children={<div>Test Content</div>} />);

    const flexWithAsChild = document.querySelector("[data-as-child='true']");
    expect(flexWithAsChild).toBeInTheDocument();
  });
});
