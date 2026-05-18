import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer", () => {
  it("renders the Footer component", () => {
    render(<Footer />);
  });

  it("renders three cards with correct headings", () => {
    render(<Footer />);

    expect(screen.getByText("Documentation")).toBeInTheDocument();
    expect(screen.getByText("API Reference")).toBeInTheDocument();
    expect(screen.getByText("WorkOS")).toBeInTheDocument();
  });

  it("renders correct description texts", () => {
    render(<Footer />);

    expect(
      screen.getByText("View integration guides and SDK documentation."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Every WorkOS API method and endpoint documented."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Learn more about other WorkOS products."),
    ).toBeInTheDocument();
  });

  it("renders links with correct hrefs", () => {
    render(<Footer />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);

    expect(links[0]).toHaveAttribute("href", "https://workos.com/docs");
    expect(links[1]).toHaveAttribute(
      "href",
      "https://workos.com/docs/reference",
    );
    expect(links[2]).toHaveAttribute("href", "https://workos.com");
  });

  it("renders links with correct target and rel attributes", () => {
    render(<Footer />);

    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    });
  });
});
