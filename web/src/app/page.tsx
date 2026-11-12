
"use client";

// LLM: Task dashboard with CRUD, search, filters and priority summaries.

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  X,
  AlertCircle,
  Clock3,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Returns today's date in YYYY-MM-DD format.
function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Calculates the number of days until a task is due.
function daysUntil(date: string, today: string) {
  const due = Date.parse(`${date.slice(0, 10)}T00:00:00Z`);
  const current = Date.parse(`${today}T00:00:00Z`);

  return Math.round((due - current) / 86400000);
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Controls the create and edit dialog.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Stores the task selected for deletion.
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Stores search, filter and sorting selections.
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");
  const [sortOrder, setSortOrder] =
    useState<SortOrder>("DEFAULT");

  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(getToday());
  }, []);

  // Retrieves tasks from the NestJS backend.
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

  // Loads tasks when the page opens.
  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  // Calculates priority counts using task due dates.
  const priorities = useMemo(() => {
    const counts = {
      high: 0,
      medium: 0,
      low: 0,
    };

    if (!today) return counts;

    for (const task of tasks) {
      // Completed tasks do not need priority tracking.
      if (task.status === "DONE" || !task.dueDate) {
        continue;
      }

      const days = daysUntil(task.dueDate, today);

      if (days <= 2) {
        counts.high++;
      } else if (days <= 7) {
        counts.medium++;
      } else {
        counts.low++;
      }
    }

    return counts;
  }, [tasks, today]);

  // Filters and sorts tasks without modifying database records.
  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        (task.description ?? "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "ALL" ||
        task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    if (sortOrder === "DEFAULT") {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      // Tasks without due dates always appear last.
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const difference =
        Date.parse(a.dueDate) - Date.parse(b.dueDate);

      return sortOrder === "EARLIEST"
        ? difference
        : -difference;
    });
  }, [tasks, search, statusFilter, sortOrder]);

  // Opens an empty form for creating a task.
  function handleCreate() {
    setEditingTask(null);
    setDialogOpen(true);
  }

  // Opens the form with an existing task's information.
  function handleEdit(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  // Resets search, filters and sorting.
  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
    setSortOrder("DEFAULT");
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header with larger logo */}
        <header className="flex flex-col gap-5 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">

            {/* Logo container */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 p-2 shadow-sm">
              <Image
                src="/blue-harbor-logo.png"
                alt="Blue Harbor Task Manager logo"
                width={96}
                height={96}
                className="h-24 w-24 object-contain"
                priority
              />
            </div>

            {/* Application title */}
            <div>
              <p className="mb-1 text-xs font-bold tracking-[0.22em] text-blue-600">
                BLUE HARBOR
              </p>

              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Task Manager
              </h1>

              <p className="mt-2 text-slate-500">
                <i>Plan, prioritize, manage, and complete tasks efficiently.</i>
              </p>
            </div>
          </div>

          {/* Create task button */}
          <Button
            onClick={handleCreate}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 size-4" />
            New Task
          </Button>
        </header>

        {/* Task count and priority cards */}
        <section
          aria-label="Task summary"
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
        >

          {/* Total tasks */}
          <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Total Tasks
              </p>

              <ClipboardList className="size-5 text-blue-500" />
            </div>

            <p className="mt-3 text-3xl font-bold text-blue-700">
              {tasks.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              All saved tasks
            </p>
          </div>

          {/* High priority */}
          <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                High Priority
              </p>

              <AlertCircle className="size-5 text-red-500" />
            </div>

            <p className="mt-3 text-3xl font-bold text-red-600">
              {priorities.high}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Due within 2 days or overdue
            </p>
          </div>

          {/* Medium priority */}
          <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Medium Priority
              </p>

              <Clock3 className="size-5 text-amber-500" />
            </div>

            <p className="mt-3 text-3xl font-bold text-amber-600">
              {priorities.medium}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Due in 3-7 days
            </p>
          </div>

          {/* Low priority */}
          <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Low Priority
              </p>

              <CheckCircle2 className="size-5 text-green-500" />
            </div>

            <p className="mt-3 text-3xl font-bold text-green-600">
              {priorities.low}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Due after 7 days
            </p>
          </div>
        </section>

        {/* Search, status filter and due date sorting */}
        <section className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm lg:flex-row lg:items-center">

          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <Input
              aria-label="LLM Search tasks"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 border-blue-100 pl-10"
            />
          </div>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as StatusFilter)
            }
          >
            <SelectTrigger
              aria-label="LLM Filter by status"
              className="h-11 w-full border-blue-100 lg:w-44"
            >
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">
                All statuses
              </SelectItem>

              <SelectItem value="TODO">
                To Do
              </SelectItem>

              <SelectItem value="IN_PROGRESS">
                In Progress
              </SelectItem>

              <SelectItem value="DONE">
                Done
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Due date sorting */}
          <Select
            value={sortOrder}
            onValueChange={(value) =>
              setSortOrder(value as SortOrder)
            }
          >
            <SelectTrigger
              aria-label="LLM Sort by due date"
              className="h-11 w-full border-blue-100 lg:w-44"
            >
              <SelectValue placeholder="Due date" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="DEFAULT">
                Default order
              </SelectItem>

              <SelectItem value="EARLIEST">
                Earliest first
              </SelectItem>

              <SelectItem value="LATEST">
                Latest first
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Clear filters button */}
          {(search ||
            statusFilter !== "ALL" ||
            sortOrder !== "DEFAULT") && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-11 border-blue-100 text-blue-700 hover:bg-blue-50"
            >
              <X className="mr-1 size-4" />
              Clear
            </Button>
          )}
        </section>

        {/* Main task table */}
        <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">

          {/* Table heading */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-slate-900">
              LLM Your Tasks
            </h2>

            <span className="text-sm text-slate-500">
              {visibleTasks.length} of {tasks.length} tasks
            </span>
          </div>

          {/* Table content */}
          <div className="p-4 sm:p-6">
            {loading ? (
              <p className="py-12 text-center text-slate-500">
                Loading tasks...
              </p>
            ) : error ? (
              <div
                role="alert"
                className="py-12 text-center"
              >
                <p className="mb-4 text-red-600">
                  {error}
                </p>

                <Button
                  variant="outline"
                  onClick={() => void loadTasks()}
                >
                  Try Again
                </Button>
              </div>
            ) : tasks.length > 0 &&
              visibleTasks.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-slate-500">
                  No tasks match your filters.
                </p>

                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <TaskTable
                tasks={visibleTasks}
                onEdit={handleEdit}
                onDelete={setDeletingTask}
              />
            )}
          </div>
        </section>
      </div>

      {/* Create and edit task dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSaved={loadTasks}
      />

      {/* Delete confirmation dialog */}
      <DeleteTaskDialog
        task={deletingTask}
        onClose={() => setDeletingTask(null)}
        onDeleted={loadTasks}
      />

      {/* Success and error notifications */}
      <Toaster
        richColors
        position="bottom-right"
      />
    </main>
  );
}
