import { useCallback, useState, type ReactNode } from "react";
import { STUDENT_ID_LENGTH } from "@/config";
import { AppContext } from "@/context/app-context";

export function AppProvider({ children }: { children: ReactNode }) {
  const [studentId, setStudentId] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);
  const validStudent = studentId.length === STUDENT_ID_LENGTH;

  return (
    <AppContext.Provider
      value={{ studentId, setStudentId, validStudent, reloadKey, refresh }}
    >
      {children}
    </AppContext.Provider>
  );
}
