
"use client";

// LLM: Reusable dialog for creating and editing tasks.

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createTask,
  updateTask,
  type Task,
  type TaskStatus,
} from "@/lib/tasks";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSaved: () => Promise<void>;
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  onSaved,
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = task !== null;

  // Fills the form when editing, or resets it when creating.
  useEffect(() => {
    if (!open) return;

    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus(task?.status ?? "TODO");
    setDueDate(task?.dueDate?.slice(0, 10) ?? "");
  }, [task, open]);

  // Creates or updates a task using the same form.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a task title.");
      return;
    }

    setSaving(true);

    try {
      const data = {
        title: title.trim(),
        description: description.trim() || null,
        status,
        // Convert the date to the ISO format expected by NestJS.
        dueDate: dueDate
          ? new Date(`${dueDate}T00:00:00.000Z`).toISOString()
          : null,
      };

      if (task) {
        await updateTask(task.id, data);
      } else {
        await createTask(data);
      }

      toast.success(
        isEditing
          ? "Task updated successfully!"
          : "Task created successfully!"
      );

      onOpenChange(false);
      await onSaved();
    } catch {
      toast.error("Unable to save task. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!saving) onOpenChange(value);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "LLM Edit Task" : "LLM Create Task"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your task information."
              : "Add a new task to your list."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">LLM Title *</Label>
            <Input
              id="task-title"
              value={title}
              maxLength={150}
              required
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">
              LLM Description
            </Label>
            <Textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-status">LLM Status</Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as TaskStatus)
              }
            >
              <SelectTrigger id="task-status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">
                  In Progress
                </SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-due-date">
              LLM Due Date
            </Label>
            <Input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
