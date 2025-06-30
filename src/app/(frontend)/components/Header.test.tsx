"use client";

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
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

  it("renders HUD items with correct data", () => {
    render(<Header />);
    expect(screen.getByText("Active Deals")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Key Contacts")).toBeInTheDocument();
    expect(screen.getByText("47")).toBeInTheDocument();
  });

  it("toggles the CommandDeck on navigation button click", () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText("Open navigation menu");
    const commandDeck = screen.getByTestId("command-deck");

    expect(commandDeck).not.toHaveClass("open");
    fireEvent.click(toggleButton);
    expect(commandDeck).toHaveClass("open");
    fireEvent.click(toggleButton);
    expect(commandDeck).not.toHaveClass("open");
  });
});
