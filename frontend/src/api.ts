import { API_URL } from "@/config";
import type { ClassItem, MyHold } from "@/types";

async function request<T>(
  path: string,
  init: RequestInit = {},
  studentId?: string,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (init.body) headers["Content-Type"] = "application/json";
  if (studentId) headers["X-Student-Id"] = studentId;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...init, headers });
  } catch {
    throw new Error("Cannot reach the server");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Something went wrong";

export const api = {
  getClasses: () => request<ClassItem[]>("/classes"),

  createClass: (body: { name: string; totalSeats: number }) =>
    request<unknown>("/classes", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  apply: (classId: string, studentId: string) =>
    request<unknown>(
      `/classes/${classId}/holds`,
      { method: "POST" },
      studentId,
    ),

  confirm: (holdId: string, studentId: string) =>
    request<unknown>(`/holds/${holdId}/confirm`, { method: "POST" }, studentId),

  cancel: (holdId: string, studentId: string) =>
    request<void>(`/holds/${holdId}`, { method: "DELETE" }, studentId),

  getMyHolds: (studentId: string) =>
    request<MyHold[]>("/me/holds", {}, studentId),
};
