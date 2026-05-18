import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SignInButton } from "./sign-in-button";

// Mock the useAuth hook - must match the import path in the source file
jest.mock("@workos-inc/authkit-nextjs/components", () => ({
  useAuth: jest.fn(),
}));

// Mock the signOut action
jest.mock("../actions/signOut", () => ({
  handleSignOutAction: jest.fn(),
}));

// Mock Radix UI Button and Flex components
jest.mock("@radix-ui/themes", () => ({
  Button: ({ children, asChild, size, type, ...props }: any) => {
    if (asChild) {
      return <>{children}</>;
    }
    return (
      <button type={type} data-size={size} {...props}>
        {children}
      </button>
    );
  },
  Flex: ({ children, gap, ...props }: any) => (
    <div data-gap={gap} {...props}>
      {children}
    </div>
  ),
}));

const { useAuth } = require("@workos-inc/authkit-nextjs/components") as {
  useAuth: jest.Mock;
};

describe("SignInButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state when loading is true", () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    render(<SignInButton />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders Sign Out button when user is logged in", () => {
    useAuth.mockReturnValue({
      user: { id: "1", email: "test@example.com" },
      loading: false,
    });

    render(<SignInButton />);

    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("renders Sign In link when user is not logged in", () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(<SignInButton />);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Sign In" });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("renders 'Sign In with AuthKit' when large prop is true and user is not logged in", () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(<SignInButton large />);

    expect(screen.getByText("Sign In with AuthKit")).toBeInTheDocument();
  });

  it("renders Sign Out button with correct size when large prop is true and user is logged in", () => {
    useAuth.mockReturnValue({
      user: { id: "1", email: "test@example.com" },
      loading: false,
    });

    render(<SignInButton large />);

    const signOutButton = screen.getByText("Sign Out").closest("button");
    expect(signOutButton).toHaveAttribute("data-size", "3");
  });

  it("renders Sign In button with correct size when large prop is true", () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(<SignInButton large />);

    const link = screen.getByRole("link", { name: "Sign In with AuthKit" });
    expect(link).toHaveAttribute("href", "/login");
  });
});
