
"use client";

// LLM: Confirms deletion before permanently removing a task.

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteTask, type Task } from "@/lib/tasks";

interface DeleteTaskDialogProps {
  task: Task | null;
  onClose: () => void;
  onDeleted: () => Promise<void>;
}

export function DeleteTaskDialog({
  task,
  onClose,
  onDeleted,
}: DeleteTaskDialogProps) {
  const [deleting, setDeleting] = useState(false);

  // Deletes the task only after user confirmation.
  async function handleDelete() {
    if (!task) return;

    setDeleting(true);

    try {
      await deleteTask(task.id);
      toast.success("Task deleted successfully!");
      onClose();
      await onDeleted();
    } catch {
      toast.error("Unable to delete task. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog
      open={task !== null}
      onOpenChange={(open) => {
        if (!open && !deleting) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            LLM Delete Task?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete
            {" "}
            <strong>{task?.title}</strong>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={deleting}
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {deleting ? "Deleting..." : "Delete Task"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
