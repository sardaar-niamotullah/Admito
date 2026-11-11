import { useState } from "react";
import { errorMessage } from "@/api";
import { useApp } from "@/hooks/useApp";

// Runs a button action: tracks busy and error state, then refreshes every list.
export function useAction() {
  const { refresh } = useApp();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(task: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    try {
      await task();
      return true;
    } catch (e) {
      setError(errorMessage(e));
      return false;
    } finally {
      setBusy(false);
      refresh();
    }
  }

  return { run, busy, error };
}
