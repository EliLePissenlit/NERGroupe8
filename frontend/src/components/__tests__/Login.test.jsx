import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login";

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    isAuthenticated: false
  })
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe("Login component", () => {
  it("soumet le formulaire avec les bonnes valeurs", async () => {
    mockLogin.mockResolvedValueOnce({ success: true });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), "admin@test.com");
    await userEvent.type(screen.getByLabelText(/mot de passe/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(mockLogin).toHaveBeenCalledWith("admin@test.com", "password");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("affiche un message d'erreur si le login échoue", async () => {
    mockLogin.mockResolvedValueOnce({
      success: false,
      error: "Identifiants invalides"
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), "admin@test.com");
    await userEvent.type(screen.getByLabelText(/mot de passe/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    expect(await screen.findByText(/identifiants invalides/i)).toBeInTheDocument();
  });
});