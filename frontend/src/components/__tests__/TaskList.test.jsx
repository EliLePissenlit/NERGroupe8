import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskList from "../TaskList";

vi.mock("../TaskCard", () => ({
  default: ({ task }) => <div>{task.title}</div>
}));

describe("TaskList component", () => {
  it("affiche les colonnes et répartit les tâches par statut", () => {
    const tasks = [
      { id: 1, title: "Tâche 1", status: "todo" },
      { id: 2, title: "Tâche 2", status: "progress" },
      { id: 3, title: "Tâche 3", status: "done" }
    ];

    render(<TaskList tasks={tasks} onEditTask={vi.fn()} />);

    expect(screen.getByText("À faire")).toBeInTheDocument();
    expect(screen.getByText("En cours")).toBeInTheDocument();
    expect(screen.getByText("Terminé")).toBeInTheDocument();

    expect(screen.getByText("Tâche 1")).toBeInTheDocument();
    expect(screen.getByText("Tâche 2")).toBeInTheDocument();
    expect(screen.getByText("Tâche 3")).toBeInTheDocument();
  });

  it("affiche un message vide si une colonne ne contient aucune tâche", () => {
    const tasks = [{ id: 1, title: "Tâche unique", status: "todo" }];

    render(<TaskList tasks={tasks} onEditTask={vi.fn()} />);

    expect(screen.getByText("Aucune tâche en cours")).toBeInTheDocument();
    expect(screen.getByText("Aucune tâche terminé")).toBeInTheDocument();
  });
});