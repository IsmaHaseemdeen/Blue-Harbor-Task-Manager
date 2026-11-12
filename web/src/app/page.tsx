
"use client";

// LLM: Main dashboard with task CRUD, filtering, and sorting.

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Plus, ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";

import { TaskTable } from "@/components/task-table";
import { TaskDialog } from "@/components/task-dialog";
import { DeleteTaskDialog } from "@/components/delete-task-dialog";
import { getTasks, type Task, type TaskStatus } from "@/lib/tasks";

type StatusFilter = TaskStatus | "ALL";
type SortOrder = "DEFAULT" | "EARLIEST" | "LATEST";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Controls the create/edit dialog.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Tracks the task selected for deletion.
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Stores selected filter and sorting options.
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");
  const [sortOrder, setSortOrder] =
    useState<SortOrder>("DEFAULT");

  // Loads tasks from the NestJS backend.
  const loadTasks = useCallback(async () => {
    try {
      setError("");
      setTasks(await getTasks());
    } catch {
      setError("Unable to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  // Filters tasks by status and sorts by due date.
  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter(
      (task) =>
        statusFilter === "ALL" ||
        task.status === statusFilter
    );

    if (sortOrder === "DEFAULT") return filtered;

    return [...filtered].sort((a, b) => {
      // Tasks without due dates always appear last.
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const difference =
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime();

      return sortOrder === "EARLIEST"
        ? difference
        : -difference;
    });
  }, [tasks, statusFilter, sortOrder]);

  // Opens an empty form to create a task.
  function handleCreate() {
    setEditingTask(null);
    setDialogOpen(true);
  }

  // Opens the form with the selected task's details.
  function handleEdit(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold tracking-widest text-muted-foreground">
            BLUE HARBOR
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            LLM Task Manager
          </h1>

          <p className="mt-2 text-muted-foreground">
            Organize and keep track of your tasks.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 size-4" />
          New Task
        </Button>
      </header>

      <section className="rounded-xl border bg-card p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              LLM Your Tasks
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {tasks.length} total tasks
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Filter tasks by their current status. */}
            <div className="space-y-2">
              <Label htmlFor="status-filter">
                LLM Filter by status
              </Label>

              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as StatusFilter)
                }
              >
                <SelectTrigger
                  id="status-filter"
                  className="w-full sm:w-44"
                >
                  <ListFilter className="size-4" />
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">
                    All statuses
                  </SelectItem>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">
                    In Progress
                  </SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort tasks by due date. */}
            <div className="space-y-2">
              <Label htmlFor="due-date-sort">
                LLM Sort by due date
              </Label>

              <Select
                value={sortOrder}
                onValueChange={(value) =>
                  setSortOrder(value as SortOrder)
                }
              >
                <SelectTrigger
                  id="due-date-sort"
                  className="w-full sm:w-44"
                >
                  <SelectValue placeholder="Default" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="DEFAULT">
                    Default
                  </SelectItem>
                  <SelectItem value="EARLIEST">
                    Earliest first
                  </SelectItem>
                  <SelectItem value="LATEST">
                    Latest first
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="py-12 text-center text-muted-foreground">
            Loading tasks...
          </p>
        ) : error ? (
          <div role="alert" className="py-12 text-center">
            <p className="mb-4 text-destructive">
              {error}
            </p>
            <Button
              variant="outline"
              onClick={() => void loadTasks()}
            >
              Try Again
            </Button>
          </div>
        ) : tasks.length > 0 && visibleTasks.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No tasks match this filter.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setStatusFilter("ALL")}
            >
              Clear Filter
            </Button>
          </div>
        ) : (
          <TaskTable
            tasks={visibleTasks}
            onEdit={handleEdit}
            onDelete={setDeletingTask}
          />
        )}
      </section>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSaved={loadTasks}
      />

      <DeleteTaskDialog
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onDeleted={loadTasks}
      />

      <Toaster richColors position="bottom-right" />
    </main>
  );
}
