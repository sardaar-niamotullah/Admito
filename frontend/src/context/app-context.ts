import { createContext } from "react";

export interface AppState {
  studentId: string;
  setStudentId: (id: string) => void;
  validStudent: boolean;
  reloadKey: number; // changes after every action, lists reload when it changes
  refresh: () => void;
}

export const AppContext = createContext<AppState | null>(null);
