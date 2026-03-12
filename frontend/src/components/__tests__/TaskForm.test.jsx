import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskForm from "../TaskForm";

const createTaskMock = vi.fn();
const updateTaskMock = vi.fn();

vi.mock("../../contexts/TaskContext", () => ({
  useTask: () => ({
    createTask: createTaskMock,
    updateTask: updateTaskMock,
    users: [
      { id: 1, name: "Alice", email: "alice@test.com" },
      { id: 2, name: "Bob", email: "bob@test.com" }
    ]
  })
}));

describe("TaskForm component", () => {
  it("affiche le formulaire et les utilisateurs", () => {
    render(<TaskForm onClose={vi.fn()} />);

    expect(screen.getByText("Nouvelle tâche")).toBeInTheDocument();
    expect(screen.getByLabelText(/Titre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
  });

  it("soumet le formulaire pour créer une tâche", async () => {
    createTaskMock.mockResolvedValue({ success: true });
    const onCloseMock = vi.fn();

    render(<TaskForm onClose={onCloseMock} />);

    fireEvent.change(screen.getByLabelText(/Titre/i), {
      target: { value: "Ma nouvelle tâche" }
    });

    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Description test" }
    });

    fireEvent.change(screen.getByLabelText(/Priorité/i), {
      target: { value: "high" }
    });

    fireEvent.change(screen.getByLabelText(/Assigné à/i), {
      target: { value: "1" }
    });

    fireEvent.click(screen.getByRole("button", { name: /Créer/i }));

    await waitFor(() => {
      expect(createTaskMock).toHaveBeenCalledWith({
        title: "Ma nouvelle tâche",
        description: "Description test",
        priority: "high",
        assignedTo: "1"
      });
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});