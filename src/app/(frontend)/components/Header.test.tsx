"use client";

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("renders the header element with mission-control-hud class", () => {
    render(<Header />);
    const headerElement = screen.getByRole("banner"); // header is typically a banner role
    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toHaveClass("mission-control-hud");
  });

  it("renders the CDH logo and text", () => {
    render(<Header />);
    expect(screen.getByText("CDH")).toBeInTheDocument();
    expect(screen.getByLabelText("Open navigation menu")).toBeInTheDocument();
  });

  it("toggles the CommandDeck on mobile navigation button click", () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText("Open navigation menu");
    const commandDeck = screen.getByRole("dialog", { hidden: true }); // Assuming CommandDeck will have a dialog role

    expect(commandDeck).not.toHaveClass("open");
    fireEvent.click(toggleButton);
    expect(commandDeck).toHaveClass("open");
    fireEvent.click(toggleButton);
    expect(commandDeck).not.toHaveClass("open");
  });
});
