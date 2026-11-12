
"use client";

// LLM: Displays tasks in a readable table with status badges and actions.

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task, TaskStatus } from "@/lib/tasks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusStyles: Record<
  TaskStatus,
  { label: string; className: string }
> = {
  TODO: {
    label: "To Do",
    className: "bg-red-50 text-red-600",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-yellow-50 text-yellow-700",
  },
  DONE: {
    label: "Done",
    className: "bg-green-50 text-green-600",
  },
};

export function TaskTable({
  tasks,
  onEdit,
  onDelete,
}: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500">
        No tasks yet
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-52 text-sm font-semibold text-slate-700">
            Title
          </TableHead>

          <TableHead className="min-w-64 text-sm font-semibold text-slate-700">
            Description
          </TableHead>

          <TableHead className="text-sm font-semibold text-slate-700">
            Status
          </TableHead>

          <TableHead className="whitespace-nowrap text-sm font-semibold text-slate-700">
            Due Date
          </TableHead>

          <TableHead className="text-right text-sm font-semibold text-slate-700">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tasks.map((task) => (
          <TableRow
            key={task.id}
            className="hover:bg-slate-50"
          >
            {/* Compact task title */}
            <TableCell className="text-base font-medium text-slate-900">
              {task.title}
            </TableCell>

            {/* Shortened description with full text on hover */}
            <TableCell className="max-w-xs">
              <p
                className="truncate text-sm text-slate-600"
                title={task.description || undefined}
              >
                {task.description || "-"}
              </p>
            </TableCell>

            {/* Colored status badge */}
            <TableCell>
              <Badge
                variant="secondary"
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${statusStyles[task.status].className}`}
              >
                {statusStyles[task.status].label}
              </Badge>
            </TableCell>

            {/* Task due date */}
            <TableCell className="whitespace-nowrap text-sm text-slate-700">
              {task.dueDate
                ? task.dueDate.slice(0, 10)
                : "-"}
            </TableCell>

            {/* Edit and delete actions */}
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(task)}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                  onClick={() => onDelete(task)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
