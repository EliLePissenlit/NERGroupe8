import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Login from "../Login";

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: vi.fn(),
    user: null,
    isAuthenticated: false
  })
}));

describe("Login component", () => {
  it("affiche le formulaire de connexion", () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
});