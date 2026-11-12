
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

// Represents a task returned by the NestJS backend.
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
}

// Defines the data accepted when creating or editing tasks.
export interface TaskInput {
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null;
}

// Backend API URL configured through environment variables.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// Handles API requests, errors, and empty responses.
async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  // Throws an error if the API request fails.
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  // Some successful requests do not return JSON data.
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  // Prevents errors when the response body is empty.
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

// Retrieves all tasks from the database.
export function getTasks(): Promise<Task[]> {
  return request<Task[]>("/tasks");
}

// Creates a new task.
export function createTask(data: TaskInput): Promise<Task> {
  return request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Updates an existing task by its ID.
export function updateTask(
  id: number,
  data: TaskInput
): Promise<Task> {
  return request<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Deletes a task by its ID.
export async function deleteTask(id: number): Promise<void> {
  await request<void>(`/tasks/${id}`, {
    method: "DELETE",
  });
}
