import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { STUDENT_ID_LENGTH } from "../config";

interface AppState {
  studentId: string;
  setStudentId: (id: string) => void;
  validStudent: boolean;
  version: number; // changes after every action, lists reload when it changes
  refresh: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [studentId, setStudentId] = useState("");
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  const validStudent = studentId.length === STUDENT_ID_LENGTH;

  return (
    <AppContext.Provider
      value={{ studentId, setStudentId, validStudent, version, refresh }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
