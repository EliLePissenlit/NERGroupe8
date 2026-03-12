import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "../TaskCard";

vi.mock("../../contexts/TaskContext", () => ({
  useTask: () => ({
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    users: [
      { id: 1, name: "Alice" }
    ]
  })
}));

describe("TaskCard component", () => {
  it("affiche le titre et la description de la tâche", () => {
    const task = {
      id: 1,
      title: "Test Task",
      description: "This is a test task",
      status: "todo",
      priority: "high",
      assignedTo: 1,
      createdAt: "2026-03-12T10:00:00.000Z"
    };

    render(<TaskCard task={task} onEditTask={vi.fn()} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("This is a test task")).toBeInTheDocument();
    expect(screen.getByText(/Alice/i)).toBeInTheDocument();
  });
});