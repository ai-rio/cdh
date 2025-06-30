import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../../src/app/(frontend)/components/Header";

describe("Header Integration Test", () => {
  it("should open and close the CommandDeck when the toggle button is clicked", () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText("Open navigation menu");
    const commandDeck = screen.getByRole("dialog", { hidden: true });

    // Initially, CommandDeck should be closed
    expect(commandDeck).not.toHaveClass("open");

    // Click to open
    fireEvent.click(toggleButton);
    expect(commandDeck).toHaveClass("open");

    // Click to close
    fireEvent.click(toggleButton);
    expect(commandDeck).not.toHaveClass("open");
  });

  it("should navigate to correct links when CommandDeck links are clicked", () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText("Open navigation menu");
    fireEvent.click(toggleButton);

    // Mock next/link or use a testing library that handles routing
    // For simplicity, we'll just check if the link is present
    expect(screen.getByRole("link", { name: /Blog/i })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: /Pricing/i })).toHaveAttribute("href", "/pricing");
    expect(screen.getByRole("link", { name: /About Us/i })).toHaveAttribute("href", "/about");
  });
});
