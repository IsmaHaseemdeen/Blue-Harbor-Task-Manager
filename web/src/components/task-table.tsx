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
          <TableHead className="text-base font-semibold text-slate-900">
            Title
          </TableHead>
          <TableHead className="text-base font-semibold text-slate-900">
            Description
          </TableHead>
          <TableHead className="text-base font-semibold text-slate-900">
            Status
          </TableHead>
          <TableHead className="text-base font-semibold text-slate-900">
            Due Date
          </TableHead>
          <TableHead className="text-right text-base font-semibold text-slate-900">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="text-xl font-medium text-slate-900">
              {task.title}
            </TableCell>

            <TableCell className="max-w-md text-slate-900">
              {task.description || "—"}
            </TableCell>

            <TableCell>
              <Badge
                variant="secondary"
                className={`rounded-full px-3 py-1 text-sm font-medium ${statusStyles[task.status].className}`}
              >
                {statusStyles[task.status].label}
              </Badge>
            </TableCell>

            <TableCell className="text-slate-900">
              {task.dueDate ? task.dueDate.slice(0, 10) : "—"}
            </TableCell>

            <TableCell className="text-right">
              <div className="flex justify-end gap-3">
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