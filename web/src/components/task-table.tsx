
// LLM: Displays tasks with status badges, edit and delete actions.

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Task, TaskStatus } from "@/lib/tasks";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// Converts backend statuses into readable labels.
const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export function TaskTable({
  tasks,
  onEdit,
  onDelete,
}: TaskTableProps) {
  // Displays an empty state when no tasks exist.
  if (tasks.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        LLM: No tasks yet
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">
                {task.title}
              </TableCell>

              <TableCell className="max-w-xs truncate">
                {task.description || "—"}
              </TableCell>

              <TableCell>
                <Badge variant="secondary">
                  {statusLabels[task.status]}
                </Badge>
              </TableCell>

              <TableCell>
                {task.dueDate
                  ? task.dueDate.slice(0, 10)
                  : "—"}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {/* Opens the edit dialog. */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(task)}
                  >
                    Edit
                  </Button>

                  {/* Requests confirmation before deletion. */}
                  <Button
                    size="sm"
                    variant="destructive"
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
    </div>
  );
}
